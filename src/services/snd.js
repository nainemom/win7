import { openFile } from './wm';
import { fileObject } from './fs';

export const playSound = (soundSrc) => new Promise((resolve) => openFile(fileObject('', 'sound', {
  value: soundSrc,
  onEnd: resolve,
})));
