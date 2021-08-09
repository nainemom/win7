export default {
  'Dialog':{
    canHandle: (file) => file.type === 'dialog',
  },
  'Explorer':{
    canHandle: (file) => file.type === 'directory',
  },
  'MediaPlayer':{
    canHandle: (file) => file.type === 'sound',
  },
  'Notepad':{
    canHandle: (file) => file.type === 'text',
  },
  'WebAppRunner':{
    canHandle: (file) => file.type === 'webapp',
  },
  'Camera':{
    canHandle: (file) => file.type === 'image',
  }
}
