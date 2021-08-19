const parseEl = (el) => (Array.isArray(el) ? el : [el]);
const parseEvt = (evt) => (Array.isArray(evt) ? evt : evt.split(','));

export const addEventListener = (el, evt, handler, options = false) => {
  const elList = parseEl(el);
  const evtList = parseEvt(evt);
  elList.forEach((elItem) => {
    evtList.forEach((evtItem) => {
      elItem.addEventListener(evtItem, handler, options);
    });
  });
};

export const removeEventListener = (el, evt, handler, options = false) => {
  const elList = parseEl(el);
  const evtList = parseEvt(evt);
  elList.forEach((elItem) => {
    evtList.forEach((evtItem) => {
      elItem.removeEventListener(evtItem, handler, options);
    });
  });
};
