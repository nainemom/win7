import * as BrowserFS from 'browserfs';
import { markRaw } from 'vue';
import {join} from 'path-browserify'
import { getFileType } from './apps';
const FS_BACKEND = 'InMemory';
const FS_BACKEND_OPTIONS = {};

export function reverseSlash(filePath){
  return filePath.replace(/\//g , "/")
}

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
  fs.mkdirSync('/C:/User/Desktop/dirctory');
  fs.mkdirSync('/C:/User/Documents');
  fs.mkdirSync('/C:/User/Music');
  fs.mkdirSync('/C:/User/Pictures');
  fs.mkdirSync('/C:/User/Start Menu');

  fs.writeFileSync('/C:/User/Desktop/TextFile.txt',"hello world",{ encoding: 'utf8'});
  fs.writeFileSync('/C:/User/Desktop/Music.mp3',"asdf",{ encoding: 'utf8'});
  fs.writeFileSync('/C:/User/Desktop/Me.jpg',"hello world",{ encoding: 'utf8'});
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


export async function readDirectory(path) {
  return new Promise((resolve,reject) => {
    fs.readdir(path, function (e,data) {
      if (e) {
        return reject(e);
      }
      data = data.map(it => join(path,it));
      resolve(data);
    });
  })
}

export async function fetchFile(path) {
  return new Promise((resolve,reject) => {
    fs.readFile(path, function (e,data) {
      if (e) {
        return reject(e);
      }
      resolve(data);
    });
  })
}


export async function escapeShortcut(filePath){
  const type = getFileType(filePath);
  if (type === 'shortcut') {
    return await fetchFile(filePath);
  }
  return filePath;
}
