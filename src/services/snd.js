export const playSound = (soundSrc) => {
  const audioTag = document.createElement('audio');
  audioTag.src = soundSrc;

  let addedEventListener = false;
  audioTag.play()
    .catch(e => {
      window.addEventListener('click', () => {
        playSound(soundSrc);
      }, { once: true });
    });
};

