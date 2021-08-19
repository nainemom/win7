/* eslint-disable import/prefer-default-export */
export const playBackgroundSound = (soundFile) => new Promise((resolve) => {
  const audio = new Audio(soundFile.data);
  audio.play();
  audio.onended = resolve;
});
