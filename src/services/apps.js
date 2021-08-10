import appsMeta from '../apps/AppsMeta';
import { extname } from 'path-browserify';
import { fetchTextFile } from './fs';

function isFile(filePath) {
  return !!extname(filePath);
}

function isDirectory(filePath) {
  return !extname(filePath);
}

export function fetchApp(name, isSystemApp) {
  if (isSystemApp) {
    return import('./../apps/System32/' + name + '.vue');
  } else {
    return import('./../apps/ProgramFiles/' + name + '.vue');
  }
}

export function getFileType(filePath) {
  if (isDirectory(filePath)) {
    return 'directory';
  }

  const ext = extname(filePath)
    .replace('.', '');

  if (['mp3', 'ogg', 'wma', 'wpl', 'mpa', 'mid', 'cda'].includes(ext)) {
    return 'audio';
  }
  if (['ai', 'bmp', 'gif', 'ico', 'jpeg', 'jpg', 'ps', 'psd', 'svg', 'tif', 'tiff'].includes(ext)) {
    return 'image';
  }

  if (['wapp'].includes(ext)) {
    return 'webapp';
  }

  if (['txt'].includes(ext)) {
    return 'text';
  }

  if (['link'].includes(ext)) {
    return 'shortcut';
  }

  if (['exe'].includes(ext)) {
    return 'app';
  }

  return null;
}

export function getAppForFilePath(filePath) {
  const fileType = getFileType(filePath);
  if(fileType === 'app'){
    return fetchTextFile(filePath);
  }
  for (const appName in appsMeta) {
    const { canHandle } = appsMeta[appName];
    if (canHandle && typeof canHandle === 'function') {
      if (canHandle({
        filePath,
        fileType
      })) {
        return appName;
      }
    }
  }
  return {};
}


export async function getFileWindowProperties(filePath) {
  const appName = await getAppForFilePath(filePath);
  const { windowProperties } = appsMeta[appName];
  if (!(windowProperties && typeof windowProperties === 'function')) {
    return {};
  }
  const result = await windowProperties(filePath);
  return result;
}
