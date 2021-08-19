import { addEventListener, removeEventListener } from './eventListener';

const captureOptions = {
  capture: true,
};

export const drag = (bindingElement = null, handler) => {
  const handlerParent = (event) => {
    const userAnswer = handler(event);
    if (userAnswer === false) {
      return event.preventDefault();
    }
    event.stopPropagation();
    const data = JSON.stringify(userAnswer);
    return event.dataTransfer.setData('text', data);
  };

  bindingElement.setAttribute('draggable', true);
  addEventListener(bindingElement, 'dragstart', handlerParent, captureOptions);

  return {
    stop: () => {
      removeEventListener(bindingElement, 'dragstart', handlerParent, captureOptions);
    },
  };
};

export const drop = (bindingElement = null, handler) => {
  const handlerParent = (event) => {
    event.preventDefault();
    const userData = event.dataTransfer.getData('text');
    if (userData) {
      const data = JSON.parse(userData);
      handler(data);
    }
  };
  const allowDrop = (event) => {
    event.preventDefault();
  };

  addEventListener(bindingElement, 'dragover', allowDrop, captureOptions);
  addEventListener(bindingElement, 'drop', handlerParent, captureOptions);

  return {
    stop: () => {
      removeEventListener(bindingElement, 'dragover', allowDrop, captureOptions);
      removeEventListener(bindingElement, 'drop', handlerParent, captureOptions);
    },
  };
};
