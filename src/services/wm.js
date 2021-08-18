import { reactive } from 'vue';
import {
  resolveFileSource,
  resolveFileRunner,
  getFileMetaData,
  fileObject,
} from '@/services/fs';

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

let latestZIndex = 20;

export const openFile = (_theFile) => {
  const file = resolveFileSource(_theFile);
  const runner = resolveFileRunner(file);
  if (!runner) {
    if (file.type === 'app') {
      throw new Error(`"${file.path}" cannot open without input!`);
    }
    throw new Error(`None of installed apps can handle "${file.path}"!`);
  }
  const metaData = getFileMetaData(file);
  const id = `w-${Date.now()}-${Math.random()}`;
  const win = {
    id,
    ...metaData,
    // eslint-disable-next-line no-plusplus
    zIndex: metaData.hidden ? -1 : (++latestZIndex),
    fsData: Object.freeze({
      runner,
      file: file === runner ? undefined : file,
    }),
  };
  win.left = win.left || ((window.innerWidth / 2) - (win.width / 2)) + Math.random() * 20;
  win.top = win.top || ((window.innerHeight / 2) - (win.height / 2)) + Math.random() * 20;

  windows.list.push(win);
  return win;
};

export const openDialog = (dialogObj) => new Promise((resolve) => openFile(fileObject('.dialog', 'file', {
  type: 'error',
  content: '---',
  buttons: ['OK'],
  title: 'Dialog',
  defaultInput: '',
  autoClose: true,
  ...dialogObj,
  onClick: (btn) => resolve(btn),
})));

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
