import { markRaw, reactive } from 'vue';

export const fileObject = (path, type, data = {}) => ({
  path,
  type,
  data: markRaw(data),
});

const systemFiles = [
  fileObject('C:', 'directory'),
  fileObject('D:', 'directory'),
  fileObject('C:/Program Files', 'directory'),
  fileObject('C:/Windows', 'directory'),
  fileObject('C:/User', 'directory'),
  fileObject('C:/User/Desktop', 'directory'),
  fileObject('C:/User/Pictures', 'directory'),
  fileObject('C:/User/Music', 'directory'),
  fileObject('C:/User/Documents', 'directory'),
];

export let files = reactive({
  list: [...systemFiles],
});

export const parsePath = (path) => path.split('/');

export const getPathName = (path) => {
  const parsedPath = parsePath(path);
  return parsedPath[parsedPath.length - 1];
};

export const getDirectoryFiles = (path, recursive = false) => {
  return files.list.filter((fileItem) => {
    const fileItemParsedPath = parsePath(fileItem.path);
    const fileItemDirPath = fileItemParsedPath.slice(0, fileItemParsedPath.length - 1).join('/');
    const checks = [
      fileItemDirPath === path,
    ];
    if (recursive) {
      checks.push(fileItemDirPath.startsWith(`${path}/`))
    };

    return checks.every((x) => x);
  });

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
  const directoryFiles = getDirectoryFiles(basePath);
  const newName = (i) => `New Folder${i > 1 ? ` (${i})` : ''}`;
  let name = newName(0);
  let i = 1;
  while (directoryFiles.find((fileItem) => getPathName(fileItem.path) === name)) {
    name = newName(i++);
  };
  const theFile = fileObject(`${basePath}/${name}`, 'directory');
  return createNewFile(theFile);
};

export const resolveFileByPath = (path) => files.list.find((fileItem) => fileItem.path === path);

export const resolveFileSource = (theFile) => {
  if (!theFile) {
    throw new Error(`Cannot resolve ${theFile}`);
  }
  if (theFile.type === 'shortcut') {
    return resolveFileSource(resolveFileByPath(theFile.data.src));
  }
  return theFile;
};


export const resolveFileRunner = (_thefile) => {
  const theFile = resolveFileSource(_thefile);
  if (theFile.type === 'app') {
    return theFile;
  }
  const apps = [
    ...getDirectoryFiles('C:/Windows'),
    ...getDirectoryFiles('C:/Program Files'),
  ];
  const runner = apps.find((app) => {
    if (app.data.component && typeof app.data.component.canHandle === 'function' && app.data.component.canHandle(theFile)) {
      return true;
    }
    return false;
  });
  return runner;
};

export const deleteFileByPath = (path) => {
  for(let i = files.list.length - 1; i >= 0; i--) {
    if (files.list[i].path === path || files.list[i].path.startsWith(`${path}/`)) {
      files.list.splice(i, 1);
    }
  };
};

export const searchFiles = (basePath, matcher, recursive = true) =>
  getDirectoryFiles(basePath, recursive).filter(matcher);

export const getFileWindowProperties = (_theFile) => {
  const theFile = resolveFileSource(_theFile);
  const runner = resolveFileRunner(theFile);
  const isNotApp = theFile.type !== 'app';
  const ret = runner && runner.data && runner.data.component && typeof runner.data.component.windowProperties === 'function' ? runner.data.component.windowProperties(isNotApp && theFile) : {};
  return ret;
}
// {
//   files,
//   fileObject,
//   initFs,
//   parsePath,
//   getPathName,
//   createNewFile,
//   createNewFolder,
//   resolveTruePath,
//   installApp,
//   installSystemApp,
//   getDirectoryFiles,
//   resolveFile,
//   getPathRunner,
//   deleteFile,
//   searchFiles,
//   getFileWindowProperties,
// }
