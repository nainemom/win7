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

export const config = reactive({});

export const setConfig = (obj) => {
  Object.entries(obj).forEach(([key, value]) => {
    localStorage.setItem(`config-${key}`, JSON.stringify(value));
    config[key] = value;
  });
};

// list of config items and default values
config.wallpaperPath = getConfigItem('wallpaperPath', 'C:/Windows/system/wallpapers/01.jpg');
