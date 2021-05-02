import { openFile } from './wm';
import { fileObject } from './fs';

export const playSound = (soundSrc) => new Promise((resolve) => openFile(fileObject('', 'sound', {
  hidden: true,
  value: soundSrc,
  onEnd: resolve,
})));
