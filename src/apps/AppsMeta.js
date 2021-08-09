import { getPathName } from '../services/fs';

import fileIcon from '../assets/icons/jpg.png?url';
import icon from '../assets/icons/camera.png?url';
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
          return icon;
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
      icon,
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
      icon: file ? fileIcon : icon,
      width: 600,
      height: 500,
    }),
  },
  'WebAppRunner':{
    canHandle: (file) => file.type === 'webapp',
    windowProperties: (file) => ({
      icon: file && file.data.icon ? file.data.icon : icon,
      width: file && file.data.width ? file.data.width : 600,
      height: file && file.data.height ? file.data.height : 500,
    }),
  },
  'Camera':{
    canHandle: (file) => file.type === 'image',
    windowProperties: (file) => ({
      icon: file ? fileIcon : icon,
      width: 600,
      height: 500,
      title: file ? getPathName(file.path) : 'Camera',
    }),
  }
}
