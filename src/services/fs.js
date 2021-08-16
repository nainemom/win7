import * as BrowserFS from 'browserfs';
import { getFileType } from './apps';

import { join, extname, basename, dirname } from 'path-browserify';

let fs = {};

export async function initFS() {
  fs = await getFS();
  await populateFS();
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
  //await new Promise(r => setTimeout(r, 500));
  return new Promise((resolve, reject) => {
    fs.readdir(path, function (e, data) {
      if (e) {
        return reject(e);
      }
      data = data.map(it => join(path, it));
      resolve(data);
    });
  });
}

export async function fetchTextFile(path) {
  //await new Promise(r => setTimeout(r,1500));
  //return fetchFile(path, { encoding: 'utf8' });
  return fetchFile(path, { encoding: 'utf8' });
}

export async function fetchFile(path, options = {}) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, options, function (e, data) {
      if (e) {
        return reject(e);
      }
      resolve(data);
    });
  });
}

export async function deletePath(path) {
  if (isDirectory(path)) {
    return deleteDirectory(path);
  } else {
    return deleteFile(path);
  }
}

export async function deleteFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, function (e) {
      if (e) {
        return reject(e);
      }
      resolve();
    });
  });
}

export async function deleteDirectory(filePath) {
  if (await isEmptyDirectory(filePath)) {
    await new Promise((resolve, reject) => {
      fs.rmdir(filePath, function () {
        resolve();
      });
    });
  } else {
    const files = await readDirectory(filePath);
    for (const file of files) {
      if (isFile(file)) {
        await deleteFile(file);
      } else {
        await deleteDirectory(file);
        await new Promise((resolve, reject) => {
          fs.rmdir(file, function () {
            resolve();
          });
        });
      }
    }
  }
}

export async function createNewFolder(filePath, directoryName) {
  if (!directoryName) {
    directoryName = await getNewFolderName(filePath);
  }
  return new Promise((resolve, reject) => {
    const newDirPath = join(filePath, directoryName);
    fs.mkdir(newDirPath, function (e) {
      if (e) {
        return reject(e);
      }
      resolve();
    });
  });
}

export async function createNewTextFile(filePath, fileName, content = '') {
  if (!fileName || await existsPath(join(filePath, fileName))) {
    fileName = await getNewTextFileName(filePath);
  }
  return new Promise((resolve, reject) => {
    fs.writeFile(join(filePath, fileName), content, { encoding: 'utf8' }, function (e) {
      if (e) {
        return reject(e);
      }
      resolve();
    });
  });
}

export async function escapeShortcut(filePath) {
  const type = getFileType(filePath);
  if (type === 'shortcut') {
    return await fetchTextFile(filePath);
  }
  return filePath;
}

export async function writeTextFile(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, { encoding: 'utf8' }, function (e) {
      if (e) {
        return reject(e);
      }
      resolve();
    });
  });
}

export async function renamePath(filePath, newName) {
  await fs.rename(filePath, join(dirname(filePath), newName));
}

export async function moveFile(oldFile, directory) {
  await new Promise((resolve, reject) => {
    const newFile = join(directory, basename(oldFile));
    fs.rename(oldFile, newFile, resolve);
  });
}

export async function copyFile(filePath, directory) {
  const fileContent = await fetchFile(filePath);
  let fileName = basename(filePath);
  let targetFile;
  while (true) {
    targetFile = join(directory, fileName);
    let exists = await existsPath(targetFile);
    if (!exists) {
      break;
    }
    fileName = 'copy of ' + fileName;
  }
  await new Promise(resolve => {
    fs.writeFile(targetFile, fileContent, {}, resolve);
  });
}

export function isFile(filePath) {
  return !!extname(filePath);
}

export function isDirectory(filePath) {
  return !extname(filePath);
}

export function reverseSlash(filePath) {
  return filePath.replace(/\//g, '/');
}

export async function copyDirectory(srcDirectory, dstDirectory) {
  let targetDirectory = join(dstDirectory,basename(srcDirectory));
  if (await existsPath(targetDirectory)){
    //todo figure out what to do ? replace or rename?
  }
  await makeDirectory(targetDirectory);

  const files = await readDirectory(srcDirectory);
  for (const file of files) {
    if (isDirectory(file)) {
      const name = basename(file);
      await copyDirectory(file, join(targetDirectory, name));
    } else {
      await copyFile(file, targetDirectory);
    }
  }
}

async function makeDirectory(path, options = null) {
  if (!(await existsPath(path))) {
    return new Promise((resolve, reject) => {
      fs.mkdir(path, options, resolve);
    });
  }
}

function getFS() {
  return new Promise((resolve, reject) => {
    BrowserFS.configure({
      fs: 'MountableFileSystem',
      options: {
        '/C:': {
          fs: 'IndexedDB',
          options: {
            storeName: 'PartitionC',
          },
        },
        '/D:': {
          fs: 'IndexedDB',
          options: {
            storeName: 'PartitionD',
          }
        },
      },
    }, function (e) {
      if (e) {
        console.error(e);
        reject(e);
      }
      const _fs = BrowserFS.BFSRequire('fs');
      resolve(_fs);
    });
  });
}

async function existsPath(filePath) {
  return new Promise((resolve, reject) => {
    fs.exists(filePath, exists => {
      resolve(exists);
    });
  });
}

async function getNewFolderName(baseDir) {
  const newName = (i) => `New Folder${i > 1 ? ` (${i})` : ''}`;
  let i = 1;
  let folderName;
  do {
    folderName = join(baseDir, newName(i));
    i += 1;
  } while (await existsPath(folderName));
  return newName(i - 1);
}

async function getNewTextFileName(baseDir, fileName = 'Text File') {
  const newName = (i) => `${fileName}${i > 1 ? ` (${i})` : ''}.txt`;
  let i = 1;
  let name;
  do {
    name = join(baseDir, newName(i));
    i += 1;
  } while (await existsPath(name));
  return newName(i - 1);
}

async function isEmptyDirectory(filePath) {
  const list = await readDirectory(filePath);
  return list.length === 0;
}

async function _writePrograms() {
  //actual vue applications
  await writeTextFile('/C:/Windows/System32/Explorer.exe', 'Explorer',);
  await writeTextFile('/C:/Windows/System32/Notepad.exe', 'Notepad',);
  await writeTextFile('/C:/Windows/System32/MediaPlayer.exe', 'MediaPlayer',);
  //fs.writeFileSync('/C:/Windows/System32/BluePage.exe', 'BluePage', { encoding: 'utf8' });
  await writeTextFile('/C:/Program Files/Camera.exe', 'Camera',);

  //web apps
  const methodDraw = {
    'icon': 'https://editor.method.ac/images/favicon.svg',
    'url': 'https://editor.method.ac/',
    'width': 900,
    'height': 700
  };
  const snap = {
    'icon': 'https://passenger-pwa-cdn.snapp.ir/logos/square-minimal-144.png',
    'url': 'https://app.snapp.taxi/',
    'width': 500,
    'height': 800
  };
  const Viska = {
    'icon': 'https://viska.chat/logo-transparent.png',
    'url': 'https://viska.chat/',
    'width': 500,
    'height': 800
  };

  const win93 = {
    'icon': 'https://v1.windows93.net/favicon.ico',
    'url': 'https://v1.windows93.net/',
    'width': 1000,
    'height': 800
  };

  await writeTextFile('/C:/Program Files/Method Draw.wapp', JSON.stringify(methodDraw),);
  await writeTextFile('/C:/Program Files/Snap.wapp', JSON.stringify(snap),);
  await writeTextFile('/C:/Program Files/Viska.wapp', JSON.stringify(Viska),);
  await writeTextFile('/C:/Program Files/win93.wapp', JSON.stringify(win93),);

  //shortcuts
  await writeTextFile('/C:/User/Desktop/My Computer.link', '/C:/Windows/System32/Explorer.exe',);
  await writeTextFile('/C:/User/Desktop/Notepad.link', '/C:/Windows/System32/Notepad.exe',);
  await writeTextFile('/C:/User/Desktop/Hayde - Saghi.link', '/C:/User/Music/Hayde - Saghi.mp3',);
  await writeTextFile('/C:/User/Desktop/Method Draw.link', '/C:/Program Files/Method Draw.wapp',);
  await writeTextFile('/C:/User/Desktop/Snap!.link', '/C:/Program Files/Snap.wapp',);
  await writeTextFile('/C:/User/Desktop/Viska.link', '/C:/Program Files/Viska.wapp',);
  await writeTextFile('/C:/User/Desktop/win93.link', '/C:/Program Files/win93.wapp',);

  await fs.mkdir('/C:/User/Desktop/New Folder');
  await writeTextFile('/C:/User/Desktop/New Folder/Text File.txt', 'hello world',);
}

async function _writeStartMenuItem() {
  await fs.writeFile('/C:/User/Start Menu/My Computer.link', '/C:/Windows/System32/Explorer.exe', { encoding: 'utf8' });
  await fs.writeFile('/C:/User/Start Menu/Desktop.link', '/C:/User/Desktop', { encoding: 'utf8' });
  await fs.writeFile('/C:/User/Start Menu/Documents.link', '/C:/User/Documents', { encoding: 'utf8' });
  await fs.writeFile('/C:/User/Start Menu/Music.link', '/C:/User/Music', { encoding: 'utf8' });
  await fs.writeFile('/C:/User/Start Menu/Pictures.link', '/C:/User/Pictures', { encoding: 'utf8' });
}

async function populateFS() {
  await fs.mkdir('/C:');
  await fs.mkdir('/D:');

  await fs.mkdir('/C:/User');
  await fs.mkdir('/C:/Program Files');
  await fs.mkdir('/C:/Windows');
  await fs.mkdir('/C:/Windows/System32');

  await fs.mkdir('/C:/User/Desktop');
  await fs.mkdir('/C:/User/Documents');
  await fs.mkdir('/C:/User/Music');
  await fs.mkdir('/C:/User/Pictures');
  await fs.mkdir('/C:/User/Start Menu');

  await _writePrograms();
  await _writeStartMenuItem();

  await fs.writeFile('/C:/User/Desktop/TextFile.txt', 'hello world', { encoding: 'utf8' });
  await fs.writeFile('/C:/User/Music/Hayde - Saghi.mp3', 'https://dl.dl2musica.com/singles/0003/Hayedeh%20-%20Saghi.mp3', { encoding: 'utf8' });
}
