import MyComputer from '/src/apps/MyComputer.vue';
import Camera from '/src/apps/Camera.vue';
import Notepad from '/src/apps/Notepad.vue';
import WebAppRunner from '/src/apps/WebAppRunner.vue';

const app = (name, component) => ({
  type: 'app',
  name,
  component,
});

const webapp = (name, data) => ({
  type: 'webapp',
  name,
  data,
});

const file = (name, data) => ({
  type: 'file',
  name,
  data,
});

const directory = (name, files = []) => ({
  type: 'directory',
  name,
  files,
});

const shortcut = (name, path) => ({
  type: 'shortcut',
  name,
  resolve: () => resolvePath(path),
});

const root = directory('root', [
  directory('C:', [
    directory('Program Files', [
      app('My Computer', MyComputer),
      app('Camera.exe', Camera),
      app('Notepad.exe', Notepad),
      app('Web App Runner.exe', WebAppRunner),
    ]),
    directory('User', [
      directory('Desktop', [
        shortcut('My Computer', ['C:', 'Program Files', 'My Computer']),
        shortcut('Camera', ['C:', 'Program Files', 'Camera.exe']),
        shortcut('Notepad', ['C:', 'Program Files', 'Notepad.exe']),
        webapp('Viska', {
          icon: 'https://viska.chat/logo-transparent.png',
          url: 'https://viska.chat/',
          width: '500px',
          height: '800px',
        }),
        webapp('Method Draw', {
          icon: 'https://editor.method.ac/images/favicon.svg',
          url: 'https://editor.method.ac/',
          width: '900px',
          height: '700px',
        }),
        webapp('Tower Game', {
          icon: 'https://www.towergame.app/assets/apple-touch-icon.png',
          url: 'https://www.towergame.app/',
          width: '400px',
          height: '700px',
        }),
        webapp('Windows 93 (vm)', {
          icon: 'http://v1.windows93.net/favicon.ico',
          url: 'http://v1.windows93.net/',
          width: '1000px',
          height: '800px',
        }),
        file('Creator.txt', {
          value: 'My Name is Amir!!!',
        }),
      ]),
    ]),
  ]),
  directory('D:', [
    directory('New Folder', [
      directory('New Folder (2)', [

      ]),
    ]),
  ]),
]);

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
