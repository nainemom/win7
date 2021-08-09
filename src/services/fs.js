import * as BrowserFS from 'browserfs';
import { markRaw } from 'vue';

const FS_BACKEND = 'InMemory';
const FS_BACKEND_OPTIONS = {};

let fs = {};

function getFS() {
  return new Promise((resolve, reject) => {
    BrowserFS.configure({
      fs: FS_BACKEND,
      options: FS_BACKEND_OPTIONS,
    }, function (e) {
      if (e) {
        reject(e);
      }
      const _fs = BrowserFS.BFSRequire('fs');
      resolve(_fs);
    });
  });
}

async function populateFS() {
  fs.mkdirSync('/C:');
  fs.mkdirSync('/D:');

  fs.mkdirSync('/C:/User');
  fs.mkdirSync('/C:/Program Files');
  fs.mkdirSync('/C:/Windows');

  fs.mkdirSync('/C:/User/Desktop');
  fs.mkdirSync('/C:/User/Documents');
  fs.mkdirSync('/C:/User/Music');
  fs.mkdirSync('/C:/User/Pictures');
  fs.mkdirSync('/C:/User/Start Menu');
}

export async function initFS() {
  fs = await getFS();
  if (FS_BACKEND === 'InMemory') {
    await populateFS();
  }
}

export function createNewFile(fileObject) {
  return undefined;
}

export function getPathName() {
}

export function getFileWindowProperties() {
}

export function resolveFileRunner() {
}

export function resolveFileSource() {
}

export function fileObject(path, type, data = {}, ...extras) {
  return {
    path,
    type,
    extras: { ...extras },
  };
};

export function fileRef(path, type) {
  return {
    path,
    type
  };
}
