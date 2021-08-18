/* eslint-disable no-console */
const isDev = process.env.NODE_ENV === 'development';

export const log = (title, ...content) => {
  if (!isDev) return false;
  console.groupCollapsed(title);
  content.forEach((item) => {
    console.log(...(Array.isArray(item) ? item : item));
  });
  console.groupEnd();
  return true;
};

export const customLog = (type, ...content) => {
  if (!isDev) return false;
  console[type](...content);
  return true;
};
