import { markRaw, reactive, ref } from 'vue';
import UnknownIcon from '/src/assets/icons/unknown.png';
import { resolveFileSource, resolveFileRunner, getFileWindowProperties, getPathName } from '/src/services/fs';


export const markedFiles = reactive({
  cutList: [],
  copyList: [],
});

export const unmarkFiles = () => {
  markedFiles.cutList = [];
  markedFiles.copyList = [];
};

export const markFileForCopy = (theFile) => {
  markedFiles.copyList.push(theFile.path);
  markedFiles.cutList = [];
};

export const markFileForCut = (theFile) => {
  markedFiles.cutList.push(theFile.path);
  markedFiles.copyList = [];
};

export const contextMenu = reactive({
  visible: false,
  items: [],
  event: null,
  onClick: null,
});

export const openContextMenu = (event, items, handler) => {
  contextMenu.event = event;
  contextMenu.onClick = handler;
  setTimeout(() => {
    contextMenu.visible = true;
    contextMenu.items = items;
  });
};

export const closeContextMenu = () => {
  contextMenu.visible = false;
  contextMenu.onClick = null;
  contextMenu.items = [];
};

export const windows = reactive({
  list: [],
});

let latestZIndex = 0;

export const calculateFileWindowProperties = (_theFile) => {
  const theFile = resolveFileSource(_theFile);
  const windowProperties = getFileWindowProperties(theFile) || {};
  const getOr = (value, defaultvalue) => typeof value === 'undefined' ? defaultvalue : value;
  const width = getOr(windowProperties.width, 400);
  const height = getOr(windowProperties.height, 400);
  return {
    title: windowProperties.title || getPathName(theFile.path) || 'Window',
    maximizable: getOr(windowProperties.maximizable, true),
    closable: getOr(windowProperties.closable, true),
    minimizable: getOr(windowProperties.minimizable, true),
    movable: true,
    maximized: getOr(windowProperties.maximized, false),
    minimized: getOr(windowProperties.maximized, false),
    width,
    height,
    left: (window.innerWidth / 2) - (width / 2) + (Math.random() * 20) - 10,
    top: (window.innerHeight / 2) - (height / 2) + (Math.random() * 20) - 10,
    icon: getOr(windowProperties.icon, UnknownIcon),
    zIndex: ++latestZIndex,
  };
};

export const openFile = (_theFile) => {
  const theFile = resolveFileSource(_theFile);
  const runner = resolveFileRunner(theFile);
  const windowProperties = calculateFileWindowProperties(theFile);

  const win = {
    id: `w-${Date.now()}-${Math.random()}`,
    ...windowProperties,
    fsData: Object.freeze({
      runner: runner,
      file: runner.path !== theFile.path ? theFile : null,
    }),
  };

  windows.list.push(win);
  return win;
};

export const findWindowById = (id, returnIndex = false) => {
  return windows.list[returnIndex ? 'findIndex' : 'find']((win) => win.id === id);
}

export const closeWindow = (id) => {
  const theWinIndex = findWindowById(id, true);
  if (theWinIndex !== -1) {
    windows.list.splice(theWinIndex, 1);
  }
};

export const minimizeWindow = (id, _newValue) => {
  const theWin = findWindowById(id);
  const newValue = typeof _newValue !== 'boolean' ? !theWin.minimized : _newValue;
  theWin.zIndex = newValue ? -1 : ++latestZIndex;
  theWin.minimized = newValue;
};

export const maximizeWindow = (id, _newValue) => {
  const theWin = findWindowById(id);
  if (theWin.minimized) {
    minimizeWindow(id, false);
  }
  const newValue = typeof _newValue !== 'boolean' ? !theWin.maximized : _newValue;
  theWin.zIndex = ++latestZIndex;
  theWin.maximized = newValue;
};

export const focusWindow = (id) => {
  const theWin = findWindowById(id);
  if (theWin) {
    theWin.zIndex = ++latestZIndex;
  }
};

export const isWindowFocused = (id) => {
  const win = findWindowById(id);
  if (win) {
    const max = Math.max(...windows.list.map((w) => w.zIndex));
    return max !== -1 && max === win.zIndex;
  }
  return false;
};



// calculateWindowProperties, openFile, findWindowById, closeWindow, focusWindow, isWindowFocused, getWindows
