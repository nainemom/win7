import { markRaw, reactive } from 'vue';

export const fileObject = (path, type, data) => ({
  path,
  type,
  data: typeof data === 'object' ? markRaw(data) : data,
});

export const files = reactive({
  list: [],
});

export const parsePath = (path) => (path || '').split('/');

export const getPathName = (path) => {
  const parsedPath = parsePath(path);
  return parsedPath[parsedPath.length - 1];
};
export const getPathDir = (path) => {
  const parsedPath = parsePath(path);
  if (parsedPath.length) {
    parsedPath.splice(parsedPath.length - 1, 1);
  }
  return parsedPath.join('/');
};

export const getDirectoryFiles = (path, recursive = false) => files.list.filter(
  (fileItem) => {
    if (recursive) {
      return path ? fileItem.path.startsWith(`${path}/`) : true;
    }
    return getPathDir(fileItem.path) === path;
  },
);

export const isPathExists = (path) => {
  for (let i = files.list.length - 1; i >= 0; i -= 1) {
    if (files.list[i].path === path) {
      return true;
    }
  }
  return false;
};

export const createNewFile = (theFile) => {
  if (files.list.find((fileItem) => fileItem.path === theFile.path)) {
    throw new Error(`${theFile.path} already exists!`);
  } else {
    files.list.push(theFile);
  }
};

export const createNewFolder = (basePath) => {
  if (!basePath) {
    throw new Error('Cannot Create Folder in Root Dir!');
  }
  const newName = (i) => `New Folder${i > 1 ? ` (${i})` : ''}`;
  let i = 1;
  let newFolderPath;
  do {
    newFolderPath = `${basePath}/${newName(i)}`;
    i += 1;
  } while (isPathExists(newFolderPath));

  const theFile = fileObject(newFolderPath, 'directory');
  return createNewFile(theFile);
};

export const resolveFileByPath = (path) => files.list.find((fileItem) => fileItem.path === path);

export const resolveFileSource = (theFile) => {
  if (!theFile) {
    throw new Error(`Cannot resolve ${theFile}`);
  }
  if (theFile.path.endsWith('.link')) {
    const src = theFile.data.trim();
    const srcFile = resolveFileByPath(src);
    const resolvedSrcFile = resolveFileSource(srcFile);
    return resolvedSrcFile;
  }
  return theFile;
};

export const resolveFileRunner = (_thefile) => {
  const askRunner = (app, file) => {
    const { canHandle } = (app || {}).data || {};
    return (canHandle || (() => false))(file);
  };
  const theFile = resolveFileSource(_thefile);
  if (theFile.type === 'app' && askRunner(theFile)) {
    return theFile;
  }
  const apps = files.list.filter((file) => file.path.endsWith('.vue'));
  const runner = apps.find((app) => askRunner(app, theFile));
  if (!runner) {
    return undefined;
  }
  return runner;
};

export const isPathsRelated = (pathBase, pathCheck) => pathBase === pathCheck
  || getPathDir(pathCheck) === pathBase;

export const deleteFileByPath = (path) => {
  if (getPathDir(path) === '') {
    throw new Error('Cannot delete root directory files!');
  }
  for (let i = files.list.length - 1; i >= 0; i -= 1) {
    if (isPathsRelated(path, files.list[i].path)) {
      files.list.splice(i, 1);
    }
  }
};

export const moveAndCopyCheck = (pathFrom, pathTo) => {
  if (
    getPathDir(pathFrom) === ''
    || getPathDir(pathTo) === ''
    || getPathDir(pathFrom).startsWith('C:/Windows/system')
    || getPathDir(pathTo).startsWith('C:/Windows/system')
  ) {
    throw new Error('Cannot change system reserved directory files!');
  }
  return true;
};

export const moveFileByPath = (pathFrom, pathTo) => {
  moveAndCopyCheck(pathFrom, pathTo);
  for (let i = files.list.length - 1; i >= 0; i -= 1) {
    if (isPathsRelated(pathTo, files.list[i].path)) {
      deleteFileByPath(pathTo);
    }
  }
  for (let i = files.list.length - 1; i >= 0; i -= 1) {
    if (isPathsRelated(pathFrom, files.list[i].path)) {
      files.list[i].path = files.list[i].path.replace(pathFrom, pathTo);
    }
  }
  return true;
};

export const copyFileByPath = (pathFrom, pathTo) => {
  moveAndCopyCheck(pathFrom, pathTo);
  for (let i = files.list.length - 1; i >= 0; i -= 1) {
    if (isPathsRelated(pathTo, files.list[i].path)) {
      deleteFileByPath(pathTo);
    }
  }
  const theFile = resolveFileByPath(pathFrom);
  const clonedFile = {
    ...theFile,
    path: pathTo,
    data: theFile.data,
  };
  createNewFile(clonedFile);
  return true;
};

export const searchFiles = (basePath, matcher, recursive = true) => getDirectoryFiles(
  basePath,
  recursive,
).filter(matcher);

const defaultFileMetaData = () => ({
  width: 400,
  height: 400,
  hidden: false,
  title: 'Window',
  maximizable: true,
  closable: true,
  minimizable: true,
  movable: true,
  resizable: true,
  maximized: false,
  minimized: false,
  icon: resolveFileByPath('C:/Windows/system/icons/unknown.png'),
});

export const getFileMetaData = (_theFile) => {
  let ret = defaultFileMetaData();
  try {
    const file = resolveFileSource(_theFile);
    let propertiesFrom;
    if (file.type === 'app') {
      propertiesFrom = file;
    } else {
      propertiesFrom = resolveFileRunner(file);
    }
    const { metaData } = (propertiesFrom || {}).data || {};
    if (typeof metaData === 'function') {
      ret = {
        ...ret,
        ...metaData(file.type !== 'app' ? file : undefined),
      };
    }
  } catch (_e) {
    //
  }
  return ret;
};
