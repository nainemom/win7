export const typeOf = (x) => toString.call(x).match(/\s([a-zA-Z]+)/)[1];

export const each = (obj, cb) => (typeOf(obj) === 'Object' ? Object.keys(obj).forEach((key) => cb(key, obj[key])) : obj.forEach(cb));

export const asyncEach = (obj, cb) => new Promise((resolve) => {
  const keys = typeOf(obj) === 'Object' ? Object.keys(obj) : obj;
  const doAction = (index) => cb(
    ...(
      typeOf(obj) === 'Object' ? [obj[keys[index]], keys[index]] : [keys[index], index]
    ),
  ).then(() => {
    if (index === keys.length - 1) {
      resolve();
    } else {
      doAction(index + 1);
    }
  });
  doAction(0);
});

export const offsetTo = (el, parent) => {
  let eli = el;
  const ret = {
    left: 0,
    top: 0,
  };
  const sibil = parent === null;
  while (eli && eli !== parent) {
    ret.left += eli[sibil ? 'offsetWidth' : 'offsetLeft'];
    ret.top += eli[sibil ? 'offsetHeight' : 'offsetTop'];
    eli = eli[sibil ? 'previousElementSibling' : 'offsetParent'];
  }
  return ret;
};
