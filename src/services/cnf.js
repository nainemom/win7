/* eslint-disable import/prefer-default-export */
import { reactive } from 'vue';

const getConfigItem = (key, defaultValue) => {
  const userValue = localStorage.getItem(`config-${key}`);
  if (!userValue) return defaultValue;
  try {
    return JSON.parse(localStorage.getItem(`config-${key}`));
  } catch (_e) {
    return defaultValue;
  }
};

export const values = reactive({});

export const setConfig = (obj) => {
  Object.entries(obj).forEach(([key, value]) => {
    localStorage.setItem(`config-${key}`, JSON.stringify(value));
    values[key] = value;
  });
};

// list of config items and default values
values.wallpaperPath = getConfigItem('wallpaperPath', 'C:/Windows/Wallpapers/1.jpg');
