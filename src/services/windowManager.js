import { resolveFile, resolveFileRunner } from '/src/services/fileSystem';

let windowsList = [];
export let latestWindowZIndex = 0;

export const initWindowManager = (_list = [], _latestZIndex = 0) => {
  windowsList = _list;
  latestWindowZIndex = _latestZIndex;
};

export const openWindow = (_file) => {
  const file = resolveFile(_file);
  const runner = resolveFileRunner(_file);
  const windowConfig = runner.component.appConfig.windowConfig(file) || {};
  const width = windowConfig.width || '400px';
  const height = windowConfig.height || '300px';
  const win = {
    windowProps: Object.freeze({
      id: `x-${Date.now()}`,
      createdDate: Date.now(),
      width,
      height,
      left: `${((window.innerWidth / 2) - (parseInt(width) / 2) - 25) + (Math.random() * 50)}px`,
      top: `${((window.innerHeight / 2) - (parseInt(height) / 2) - 25) + (Math.random() * 50)}px`,
      maximizable: true,
      title: file.name,
      icon: runner.component.appConfig[file.type === 'app' ? 'icon' : 'fileIcon'](file),
    }),
    componentProps: Object.freeze({
      runner,
      data: {
        ...file.data,
      },
    }),
    runtimeProps: {
      maximized: false,
      minimized: false,
      zIndex: ++latestWindowZIndex,
    },
  };
  windowsList.push(win);
};

export const findWindowById = (id, returnIndex = false) =>
  windowsList[returnIndex ? 'findIndex' : 'find']((w) => w.windowProps.id === id);

export const closeWindow = (id) => {
  const listIndex = findWindowById(id, true);
  if (listIndex !== -1) {
    windowsList.splice(listIndex, 1);
  }
};

export const focusWindow = (id) => {
  const win = findWindowById(id);
  if (win) {
    win.runtimeProps.zIndex = ++latestWindowZIndex;
  }
};

export const isWindowFocused = (id) => {
  const win = findWindowById(id);
  if (win) {
    const max = Math.max(...windowsList.map((w) => w.runtimeProps.zIndex));
    return max !== -1 && max === win.runtimeProps.zIndex;
  }
  return false;
};

export const maximizeWindow = (id, newValue) => {
  const win = findWindowById(id);
  if (win) {
    win.runtimeProps.maximized = typeof newValue !== 'undefined' ? newValue : !win.runtimeProps.maximized;
  }
};

export const minimizeWindow = (id, newValue) => {
  const win = findWindowById(id);
  if (win) {
    win.runtimeProps.minimized = typeof newValue !== 'undefined' ? newValue : !win.runtimeProps.minimized;
    if (win.runtimeProps.minimized) {
      win.runtimeProps.zIndex = -1;
    } else {
      win.runtimeProps.zIndex = ++latestWindowZIndex;
    }
  }
};
