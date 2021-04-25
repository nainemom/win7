// import MyComputer from '/src/apps/MyComputer.vue';
// import Camera from '/src/apps/Camera.vue';
// import Notepad from '/src/apps/Notepad.vue';
// import WebAppRunner from '/src/apps/WebAppRunner.vue';
import { markRaw } from 'vue';

export const app = (name, component, _path = []) => ({
  type: 'app',
  name,
  component: markRaw(component),
  path: _path,
});


export const file = (name, type, data, _path = []) => ({
  type,
  name,
  data: markRaw(data),
  path: _path,
});

export const directory = (name, files = [], _path = []) => ({
  type: 'directory',
  name,
  files,
  path: _path,
});

export const shortcut = (name, path, data, _path = []) => ({
  type: 'shortcut',
  name,
  resolve: () => resolvePath(path, data),
  path: _path,
});

export let root = directory('root', []);

export const initFileManager = (rootFiles = [], _path = []) => {
  rootFiles.forEach(file => {
    file.path = _path;
    if (file.type === 'directory') {
      file.files = initFileManager(file.files, [..._path, file.name])
    }
  });
  if (_path.length === 0) {
    root = directory('root', rootFiles);
  }
  return rootFiles;
};

export const resolveFile = (item) => {
  let ret;
  if (item.type === 'shortcut') {
    ret = item.resolve();
  } else {
    ret = item;
  }
  return ret;
};

export const resolvePath = (path, data) => {
  let target = root;
  for (let i = 0; i < path.length; i++) {
    target = target.files.find((dir) => dir.name === path[i]);
    if (target.type === 'shortcut') {
      target = target.resolve();
    }
  }
  return {
    ...target,
    data: {
      ...target.data,
      path,
      ...data,
    },
  };
};

export const resolveFileRunner = (file) => {
  if (file.component) {
    return file;
  }
  const apps = [
    ...resolvePath(['C:', 'Windows']).files,
    ...resolvePath(['C:', 'Program Files']).files
  ];
  return apps.find((item) => {
    if (item.component.appConfig.canHandle(file)) {
      return true;
    }
  });
};

export const createFile = (name, type, _path, data) => {
  const resolvedPath = resolvePath(_path);
  resolvedPath.files.push(file(name, type, data, _path));
  reload();
};

export const createFolder = (_path) => {
  const resolvedPath = resolvePath(_path);
  const _folders = resolvedPath.files.filter(_file => _file.type === 'directory').map(_dir => _dir.name);
  const name = (i) => `New Folder${i > 1 ? ` (${i})` : ''}`;
  let i = 1;
  while (_folders.includes(name(i))) {
    i++;
  };
  resolvedPath.files.push(directory(name(i), [], _path));
  reload();
};

export const deleteFile = (_path) => {
  const parentPath = resolvePath(_path.slice(0, _path.length - 1));
  const fileIndex = parentPath.files.findIndex((item) => item.name === _path[_path.length - 1]);
  parentPath.files.splice(fileIndex, 1);
  reload();
};


export const searchFiles = (text, basePathOrDirFile = [], recursive = true) => {
  const matcher = (_file) => _file.name.toLowerCase().includes(text.toLowerCase());
  const dir = basePathOrDirFile.type === 'directory' ? basePathOrDirFile : resolvePath(basePathOrDirFile);
  let ret = [];

  if (recursive) {
    for (let i = 0; i < dir.files.length; i++) {
      if (matcher(dir.files[i])) {
        ret.push(dir.files[i]);
      }
      const resolvedFile = resolveFile(dir.files[i]);
      if (resolvedFile.type === 'directory') {
        ret = [...ret, ...searchFiles(text, resolvedFile, true)];
      }
    }
  } else {
    ret = dir.files.filter(matcher);
  }
  return ret;
};

const reloadListeners = [];
const reload = () => {
  reloadListeners.forEach(cb => cb.call());
}
export const onReload = (cb) => {
  reloadListeners.push(cb);
}
export const offReload = (cb) => {
  reloadListeners.splice(reloadListeners.indexOf(cb));
}
