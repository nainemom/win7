import MyComputer from '/src/apps/MyComputer.vue';
import Camera from '/src/apps/Camera.vue';
import Notepad from '/src/apps/Notepad.vue';

import folderIcon from '/src/assets/icons/folder.png';
import myComputerIcon from '/src/assets/icons/my-computer.png';
import driveIcon from '/src/assets/icons/drive.png';
import cameraIcon from '/src/assets/icons/camera.ico';
import notepadIcon from '/src/assets/icons/notepad.png';
import txtIcon from '/src/assets/icons/txt.png';
import jpgIcon from '/src/assets/icons/jpg.png';

const drive = (name, files = []) => ({
  type: 'drive',
  name,
  icon: driveIcon,
  files,
});

const folder = (name, files = []) => ({
  type: 'folder',
  name,
  icon: folderIcon,
  files,
});

const shortcut = (target) => ({
  type: 'shortcut',
  target,
});

const app = (name, icon, component) => ({
  type: 'app',
  name,
  icon,
  component,
});

const file = (name, icon, component, data = {}) => ({
  type: 'file',
  name,
  icon,
  component,
  data,
});

const files = [
  drive('C:', [
    folder('Program Files', [
      app('Camera.exe', cameraIcon, Camera),
      app('Notepad.exe', notepadIcon, Notepad),
    ]),
    folder('User', [
      folder('Desktop', [
        app('My Computer', myComputerIcon, MyComputer),
        shortcut(['C:', 'Program Files', 'Camera.exe']),
        shortcut(['C:', 'Program Files', 'Notepad.exe']),
        file('Creator.txt', txtIcon, Notepad, {
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
