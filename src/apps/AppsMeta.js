import { fetchTextFile, getPathName, reverseSlash } from '../services/fs';

import fileIcon from '../assets/icons/jpg.png?url';
import textIcon from '../assets/icons/txt.png?url';
import cameraIcon from '../assets/icons/camera.png?url';
import webAppIcon from '../assets/icons/html.png?url';
import computerIcon from '../assets/icons/my-computer.png?url';
import notePadIcon from '../assets/icons/notepad.png?url';
import mediaPlayerIcon from '../assets/icons/mp3.png?url';
import driveIcon from '../assets/icons/drive.png?url';
import folderIcon from '../assets/icons/folder.png?url';

export default {
  'Explorer': {
    canHandle: ({ fileType }) => fileType === 'directory',
    windowProperties: async (filePath) => {
      const calcIcon = (file) => {
        if (!file || file.endsWith('.exe')) {
          return computerIcon;
        }
        return filePath.endsWith(':') ? driveIcon : folderIcon;
      };
      return ({
        icon: calcIcon(filePath),
        width: 600,
        height: 500,
        title: 'Explorer',
        isSystemApp: true,
      });
    },
  },
  'MediaPlayer': {
    canHandle: ({ fileType }) => fileType === 'audio',
    windowProperties: async (file) => {
      return ({
        icon: mediaPlayerIcon,
        height: 100,
        resizable: false,
        maximizable: false,
        isSystemApp: true,
      });
    },
  },
  'Notepad': {
    canHandle: ({ fileType }) => fileType === 'text',
    windowProperties: (file) => {
      return ({
        icon: file && !file.endsWith('.exe') ? textIcon : notePadIcon,
        width: 600,
        height: 500,
        isSystemApp: true,
      });
    },
  },
  'WebAppRunner': {
    canHandle: ({ fileType }) => fileType === 'webapp',
    windowProperties: async (filePath) => {
      const fileContent = await fetchTextFile(filePath);
      const parsed = JSON.parse(fileContent);
      return {
        title:'Method Draw',
        icon: webAppIcon,
        width: 600,
        height:  500,
        ...parsed,
        isSystemApp: true,
      };
    },
  },
  'Camera': {
    canHandle: ({ fileType }) => fileType === 'image',
    windowProperties: (file) => ({
      icon: file ? fileIcon : cameraIcon,
      width: 600,
      height: 500,
      title: file ? getPathName(file.path) : 'Camera',
    }),
  }
};
