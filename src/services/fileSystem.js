import MyComputer from '/src/apps/MyComputer.vue';
import Camera from '/src/apps/Camera.vue';
import Notepad from '/src/apps/Notepad.vue';

// import folderIcon from '/src/assets/icons/folder.png';
// import myComputerIcon from '/src/assets/icons/my-computer.png';
// import driveIcon from '/src/assets/icons/drive.png';
// import cameraIcon from '/src/assets/icons/camera.ico';
// import notepadIcon from '/src/assets/icons/notepad.png';
// import jpgIcon from '/src/assets/icons/jpg.png';
// import txtIcon from '/src/assets/icons/txt.png';

// export const drive = (name, files = []) => ({
//   type: () => 'drive',
//   name: () => name,
//   app: () => {
//     return systemApps.find((item) => {
//       if ((item.config.types || []).includes('drive')) {
//         return item;
//       }
//     });
//   },
//   files,
// });

// export const folder = (name, files = []) => ({
//   type: () => 'folder',
//   name: () => name,
//   app: () => {
//     return systemApps.find((item) => {
//       if ((item.config.types || []).includes('folder')) {
//         return item;
//       }
//     });
//   },
//   files,
// });


// export const file = (name, data = {}) => ({
//   type: 'file',
//   name: name,
//   app: () => {
//     const ext = name.substr(name.lastIndexOf('.') + 1);
//     return apps.find((item) => {
//       if ((item.config.exts || []).includes(ext)) {
//         return item;
//       }
//     });
//   },
//   data,
// });

// export const shortcut = (path) => () => getFile(path);

// export const app = (name, component) => () => ({
//   type: 'app',
//   name: name,
//   config: component.appConfig,
//   component: component,
// });

// export const systemApps = [
//   app('My Computer', MyComputer),
// ];

// export const apps = [
//   app('Notepad.exe', Notepad),
//   app('Camera.exe', Camera),
// ]


// export const files = [
//   drive('C:', [
//     folder('Windows', systemApps),
//     folder('Program Files', apps),
//     folder('User', [
//       folder('Desktop', [
//         shortcut(['C:', 'Windows', 'My Computer']),
//         shortcut(['C:', 'Program Files', 'Camera.exe']),
//         shortcut(['C:', 'Program Files', 'Notepad.exe']),
//         file('Creator.txt', {
//           value: 'My Name is Amir!!!'
//         }),
//       ]),
//     ]),
//   ]),
//   drive('D:', [
//     folder('New Folder', [
//       folder('New Folder (2)', [
//         folder('New Folder (3)', []),
//       ]),
//     ]),
//   ]),
// ];

// export const getFile = (path = []) => {
//   let target = files;
//   path.forEach((x) => {
//     const subTarget = (target.files || target).find((s) => s.name() === x);
//     if (subTarget) {
//       target = subTarget;
//     } else {
//       throw new Error('files error');
//     }
//   });
//   return target;
// };

// export const createFile = (type, name, path)



const app = (name, component) => ({
  type: 'app',
  name,
  component,
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
    ]),
    directory('User', [
      directory('Desktop', [
        shortcut('My Computer', ['C:', 'Program Files', 'My Computer']),
        shortcut('Camera', ['C:', 'Program Files', 'Camera.exe']),
        shortcut('Notepad', ['C:', 'Program Files', 'Notepad.exe']),
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
  try {
    for (let i = 0; i < length; i++) {
      target = target.files.find((dir) => dir.name === pathList[i]);
      if (!target) {
        throw new Error(`${pathList[i]} Not Found in ${pathList.join('\\')}, ${path}`);
      }
      if (target.type === 'shortcut') {
        target = target.resolve();
      }
    }
    return target;
  } catch (e) {
    throw new Error(e);
  }
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
