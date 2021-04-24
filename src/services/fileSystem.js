// import MyComputer from '/src/apps/MyComputer.vue';
// import Camera from '/src/apps/Camera.vue';
// import Notepad from '/src/apps/Notepad.vue';
// import WebAppRunner from '/src/apps/WebAppRunner.vue';

export const app = (name, component) => Object.freeze({
  type: 'app',
  name,
  component,
});

export const webapp = (name, data) => Object.freeze({
  type: 'webapp',
  name,
  data,
});

export const file = (name, data) => Object.freeze({
  type: 'file',
  name,
  data,
});

export const directory = (name, files = []) => ({
  type: 'directory',
  name,
  files,
});

export const shortcut = (name, path) => Object.freeze({
  type: 'shortcut',
  name,
  resolve: () => resolvePath(path),
});

export let root = directory('root', []);

export const initFileManager = (rootFiles = []) => {
  root = directory('root', rootFiles);
};

export const resolveFile = (item) => {
  if (item.type === 'shortcut') {
    return item.resolve();
  }
  return item;
}

export const resolvePath = (...path) => {
  const pathList = path.flat();
  const length = pathList.length;
  let target = root;
  for (let i = 0; i < length; i++) {
    target = target.files.find((dir) => dir.name === pathList[i]);
    if (target.type === 'shortcut') {
      target = target.resolve();
    }
  }
  return target;
};

export const resolveFileRunner = (file) => {
  if (file.component) {
    return file;
  }
  const apps = resolvePath(['C:', 'Program Files']).files;
  return apps.find((item) => {
    if (item.component.appConfig.canHandle(file)) {
      return true;
    }
  });
};

export const createFile = (name, _path, data) => {
  const resolvedPath = resolvePath(_path);
  resolvedPath.files.push(file(name, data));
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
