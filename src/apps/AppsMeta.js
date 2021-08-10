import { getPathName, reverseSlash } from '../services/fs';

import fileIcon from '../assets/icons/jpg.png?url';
import textIcon from '../assets/icons/txt.png?url';
import cameraIcon from '../assets/icons/camera.png?url';
import webAppIcon from '../assets/icons/html.png?url';
import computerIcon from '../assets/icons/my-computer.png?url';
import notePadIcon from '../assets/icons/notepad.png?url';
import mediaPlayerIcon from '../assets/icons/mp3.png?url';
import WarningIcon from '../assets/icons/warning.png?url';
import driveIcon from '../assets/icons/drive.png?url';
import folderIcon from '../assets/icons/folder.png?url';
import ErrorIcon from '../assets/icons/error.png?url';
import InfoIcon from '../assets/icons/info.png?url';
import QuestionIcon from '../assets/icons/question.png?url';

export default {
  'Dialog':{
    //dialog is not for opening files!
    //canHandle: ({ fileType,filePath }) => fileType === 'dialog',
    windowProperties: (arg) => {
      const typeToIconMap = {
        error: ErrorIcon,
        info: InfoIcon,
        warning: WarningIcon,
        question: QuestionIcon,
      };
      return ({
        icon: arg && arg.data.type ? typeToIconMap[arg.data.type] : WarningIcon,
        width: 580,
        height: 200,
        maximizable: false,
        title: arg && arg.data.title ? arg.data.title : 'Dialog',
        isSystemApp: true,
      });
    },
  },
  'Explorer':{
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
  'MediaPlayer':{
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
  'Notepad':{
    canHandle: ({ fileType }) => fileType === 'text',
    windowProperties: (file) => ({
      icon: file ? textIcon : notePadIcon,
      width: 600,
      height: 500,
      isSystemApp: true,
    }),
  },
  'WebAppRunner':{
    canHandle: ({ fileType }) => fileType === 'webapp',
    windowProperties: (file) => ({
      //we can fetch file data here !!!
      icon: file && file.data.icon ? file.data.icon : webAppIcon,
      width: file && file.data.width ? file.data.width : 600,
      height: file && file.data.height ? file.data.height : 500,
      isSystemApp: true,
    }),
  },
  'Camera':{
    canHandle: ({ fileType }) => fileType === 'image',
    windowProperties: (file) => ({
      icon: file ? fileIcon : cameraIcon,
      width: 600,
      height: 500,
      title: file ? getPathName(file.path) : 'Camera',
    }),
  }
}
