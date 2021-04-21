import MyComputer from '/src/apps/MyComputer.vue';
import Camera from '/src/apps/Camera.vue';
import Notepad from '/src/apps/Notepad.vue';

import folderIcon from '/src/assets/icons/folder.png';
import myComputerIcon from '/src/assets/icons/my-computer.png';
import driveIcon from '/src/assets/icons/drive.png';
import cameraIcon from '/src/assets/icons/camera.ico';
import notepadIcon from '/src/assets/icons/notepad.png';
import jpgIcon from '/src/assets/icons/jpg.png';
import txtIcon from '/src/assets/icons/txt.png';

export const drive = (name, files = []) => ({
  type: 'drive',
  name,
  icon: driveIcon,
  files,
});

export const folder = (name, files = []) => ({
  type: 'folder',
  name,
  app: () => {
    return systemApps.find((item) => {
      if ((item.config.types || []).includes('folder')) {
        return item;
      }
    });
  },
  files,
});


export const file = (name, data = {}) => ({
  type: 'file',
  name,
  app: () => {
    const ext = name.substr(name.lastIndexOf('.') + 1);
    return apps.find((item) => {
      console.log(item);
      if ((item.config.exts || []).includes(ext)) {
        return item;
      }
    });
  },
  data,
});

export const shortcut = (path) => ({
  type: 'shortcut',
  target: () => getFile(path),
});

export const app = (name, component) => ({
  type: 'app',
  name,
  config: component.appConfig,
  component,
});

export const systemApps = [
  app('My Computer', MyComputer),
];

export const apps = [
  app('Notepad.exe', Notepad),
  app('Camera.exe', Camera),
]


export const files = [
  drive('C:', [
    folder('Windows', systemApps),
    folder('Program Files', apps),
    folder('User', [
      folder('Desktop', [
        shortcut(['C:', 'Windows', 'My Computer']),
        shortcut(['C:', 'Program Files', 'Camera.exe']),
        shortcut(['C:', 'Program Files', 'Notepad.exe']),
        file('Creator.txt', {
          value: 'My Name is Amir!!!'
        }),
      ]),
    ]),
  ]),
  drive('D:', [
    folder('New Folder', [
      folder('New Folder (2)', [
        folder('New Folder (3)', []),
      ]),
    ]),
  ]),
];

export const getFile = (path = []) => {
  let target = files;
  path.forEach((x) => {
    const subTarget = (target.files || target).find((s) => s.name === x);
    if (subTarget) {
      target = subTarget;
    } else {
      throw new Error('files error');
    }
  });
  return target;
};

// export const createFile = (type, name, path)
