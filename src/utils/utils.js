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

//encoding an Uint8Array to base64
export function encode(input) {
  let keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let output = "";
  let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
  let i = 0;

  while (i < input.length) {
    chr1 = input[i++];
    chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index
    chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
      keyStr.charAt(enc3) + keyStr.charAt(enc4);
  }
  return output;
}
