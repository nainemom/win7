import { addEventListener, removeEventListener } from './eventListener';

const captureOptions = {
  passive: true,
  capture: false,
};

const moveCaptureOptions = {
  passive: true,
  capture: true,
};

const getPosFromEvent = (event) => ({
  top: event.clientY,
  left: event.clientX,
});
const getPosesDiff = (posOne, posTwo) => ({
  top: posOne.top - posTwo.top,
  left: posOne.left - posTwo.left,
});

export default (bindingElement = null, startHandler, whileHandler, finishHandler) => {
  let startPos = {};

  const whileHandlerParent = (event) => {
    const currentPos = getPosFromEvent(event);
    const diff = getPosesDiff(currentPos, startPos);
    whileHandler(diff, currentPos);
  };

  const finishHandlerParent = (event) => {
    const currentPos = getPosFromEvent(event);
    const diff = getPosesDiff(currentPos, startPos);
    finishHandler(diff, currentPos);
    removeEventListener(document.body, 'pointermove', whileHandlerParent, moveCaptureOptions);
    removeEventListener(document.body, 'pointerup', finishHandlerParent, moveCaptureOptions);
  };

  const startHandlerParent = (event) => {
    if (event.button !== 0) {
      return;
    }
    startPos = getPosFromEvent(event);
    const userAnswer = startHandler(startPos);
    if (userAnswer !== false) {
      addEventListener(document.body, 'pointermove', whileHandlerParent, moveCaptureOptions);
      addEventListener(document.body, 'pointerup', finishHandlerParent, moveCaptureOptions);
    }
  };

  addEventListener(bindingElement, 'pointerdown', startHandlerParent, captureOptions);

  return {
    cancelMove: () => {
      removeEventListener(document.body, 'pointermove', whileHandlerParent, moveCaptureOptions);
      removeEventListener(document.body, 'pointerup', finishHandlerParent, moveCaptureOptions);
    },
    stop: () => {
      removeEventListener(bindingElement, 'pointerdown', startHandlerParent, captureOptions);
      removeEventListener(document.body, 'pointermove', whileHandlerParent, moveCaptureOptions);
      removeEventListener(document.body, 'pointerup', finishHandlerParent, moveCaptureOptions);
    },
  };
};
