import { reactive } from 'vue';
import UnknownIcon from '../assets/icons/unknown.png?url';
import {
  resolveFileRunner,
  resolveFileSource,
  fileObject,
  reverseSlash,
  escapeShortcut
} from './fs';
import { getAppForFilePath, getFileType, getFileWindowProperties } from './apps';

export const state = reactive({
  started: false,
});

export const startWindowManager = () => {
  state.started = true;
};

export const markedFiles = reactive({
  cutList: [],
  copyList: [],
});

export const unmarkFiles = () => {
  markedFiles.cutList = [];
  markedFiles.copyList = [];
};

export const markFileForCopy = (filePath) => {
  markedFiles.copyList.push(filePath);
  markedFiles.cutList = [];
};

export const markFileForCut = (filePath) => {
  markedFiles.cutList.push(filePath);
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

let latestZIndex = 20;

export const calculateFileWindowProperties = async (filePath) => {
  const windowProperties = await getFileWindowProperties(filePath) || {};
  const getOr = (value, defaultvalue) => (typeof value === 'undefined' ? defaultvalue : value);
  const width = getOr(windowProperties.width, 400);
  const height = getOr(windowProperties.height, 400);
  const hidden = getOr(windowProperties.hidden, false);
  if (!hidden) {
    latestZIndex += 1;
  }
  return {
    title: windowProperties.title || reverseSlash(filePath) || 'Window',
    maximizable: getOr(windowProperties.maximizable, true),
    closable: getOr(windowProperties.closable, true),
    minimizable: getOr(windowProperties.minimizable, true),
    movable: true,
    maximized: getOr(windowProperties.maximized, false),
    minimized: getOr(windowProperties.maximized, false),
    resizable: getOr(windowProperties.resizable, true),
    hidden,
    width,
    height,
    left: (window.innerWidth / 2) - (width / 2) + (Math.random() * 20) - 10,
    top: (window.innerHeight / 2) - (height / 2) + (Math.random() * 20) - 10,
    icon: getOr(windowProperties.icon, UnknownIcon),
    zIndex: hidden ? -1 : latestZIndex,
    isSystemApp:windowProperties.isSystemApp,
  };
};

export async function openFile(filePath) {
  filePath = await escapeShortcut(filePath);
  const fileType = getFileType(filePath);
  const appName = await getAppForFilePath(filePath);
  const windowProperties = await calculateFileWindowProperties(filePath);
  const id = `w-${Date.now()}-${Math.random()}`;
  const win = {
    id,
    ...windowProperties,
    appName,
  };

  if(fileType !== 'app'){
    win.filePath = filePath;
  }

  windows.list.push(win);
  return win;
};

export const openDialog = () => {}/*(dialogObj) => new Promise((resolve) => openFile(fileObject('', 'dialog', {
  type: 'error',
  content: '---',
  buttons: ['OK'],
  title: 'Dialog',
  defaultInput: '',
  autoClose: true,
  ...dialogObj,
  onClick: (btn) => resolve(btn),
})));*/

export const findWindowById = (id, returnIndex = false) => windows.list[returnIndex ? 'findIndex' : 'find']((win) => win.id === id);

export const closeWindow = (id) => {
  const theWinIndex = findWindowById(id, true);
  if (theWinIndex !== -1) {
    windows.list.splice(theWinIndex, 1);
  }
};

export const minimizeWindow = (id, _newValue) => {
  const theWin = findWindowById(id);
  const newValue = typeof _newValue !== 'boolean' ? !theWin.minimized : _newValue;
  latestZIndex += 1;
  theWin.zIndex = newValue ? -1 : latestZIndex;
  theWin.minimized = newValue;
};

export const maximizeWindow = (id, _newValue) => {
  const theWin = findWindowById(id);
  if (theWin.minimized) {
    minimizeWindow(id, false);
  }
  const newValue = typeof _newValue !== 'boolean' ? !theWin.maximized : _newValue;
  latestZIndex += 1;
  theWin.zIndex = latestZIndex;
  theWin.maximized = newValue;
};

export const focusWindow = (id) => {
  const theWin = findWindowById(id);
  if (theWin) {
    latestZIndex += 1;
    theWin.zIndex = latestZIndex;
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
