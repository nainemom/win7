/* eslint-disable import/prefer-default-export */
import { openFile } from './wm';

export const playSound = (soundSrc) => {
  const audioTag = document.createElement('audio');
  audioTag.src = soundSrc;

  function unFailure() {
    console.log('callback');
    playSound(soundSrc);
  }

  let addedEventListener = false;
  audioTag.play()
    .catch(e => {
      window.addEventListener('click',unFailure,{once:true});
    });
};

