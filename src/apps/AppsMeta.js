import { getPathName } from '../services/fs';

import fileIcon from '../assets/icons/jpg.png?url';
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
    canHandle: (file) => file.type === 'dialog',
    windowProperties: (file) => {
      const typeToIconMap = {
        error: ErrorIcon,
        info: InfoIcon,
        warning: WarningIcon,
        question: QuestionIcon,
      };
      return ({
        icon: file && file.data.type ? typeToIconMap[file.data.type] : WarningIcon,
        width: 580,
        height: 200,
        maximizable: false,
        title: file && file.data.title ? file.data.title : 'Dialog',
      });
    },
  },
  'Explorer':{
    canHandle: (file) => file.type === 'directory',
    windowProperties: (file) => {
      const calcIcon = (file) => {
        if (!file) {
          return computerIcon;
        }
        return file.path.endsWith(':') ? driveIcon : folderIcon;
      };
      return ({
        icon: calcIcon(file),
        width: 600,
        height: 500,
        title: !file ? 'Computer' : file.path,
      });
    },
  },
  'MediaPlayer':{
    canHandle: (file) => file.type === 'sound',
    windowProperties: (file) => ({
      icon:mediaPlayerIcon,
      //todo figure it out
      hidden: file ? file.data.hidden : false,
      height: 100,
      resizable: false,
      maximizable: false,
    }),
  },
  'Notepad':{
    canHandle: (file) => file.type === 'text',
    windowProperties: (file) => ({
      icon: file ? fileIcon : notePadIcon,
      width: 600,
      height: 500,
    }),
  },
  'WebAppRunner':{
    canHandle: (file) => file.type === 'webapp',
    windowProperties: (file) => ({
      icon: file && file.data.icon ? file.data.icon : webAppIcon,
      width: file && file.data.width ? file.data.width : 600,
      height: file && file.data.height ? file.data.height : 500,
    }),
  },
  'Camera':{
    canHandle: (file) => file.type === 'image',
    windowProperties: (file) => ({
      icon: file ? fileIcon : cameraIcon,
      width: 600,
      height: 500,
      title: file ? getPathName(file.path) : 'Camera',
    }),
  }
}
