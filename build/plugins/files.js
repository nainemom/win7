import path from 'path';
import fs from 'fs';
import datauri from 'datauri/sync';


const FILES_DIR = path.resolve(__dirname, '../../files');

const getUniqueImportName = (filePath) => `File_${filePath.split('').reduce((sum, item) => `${sum}${item.charCodeAt(0)}`, '')}`;

const getFileObjectOfFsFile = (filePath) => {
  try {
    const stat = fs.lstatSync(filePath);
    const appPath = (() => {
      let withExt = filePath.replace(`${FILES_DIR}/`, '');
      return withExt.replace(path.extname(withExt), '');
    })();

    if (stat.isDirectory()) {
      return [appPath, 'directory'];
    }

    const extName = path.extname(filePath).substr(1);
    const fileType = (() => {
      if (extName === 'link') return 'shortcut';
      if (extName === 'vue') return 'app';
      if (extName === 'json') return 'json';
      if (['jpg', 'jpeg', 'svg', 'png', 'bmp', 'gif'].includes(extName)) {
        return 'image';
      }
      if (['mp3', 'wav', 'ogg'].includes(extName)) {
        return 'sound';
      }
      if (['mp4', '3gp', 'mkv'].includes(extName)) {
        return 'video';
      }
      return 'text';
    })();
    if (fileType === 'shortcut') {
      return [appPath, 'shortcut', {
        src: fs.readFileSync(filePath).toString().trim(),
      }];
    }
    if (fileType === 'app') {
      return [appPath, 'app']; // will filled later
    }
    if (fileType === 'json') {
      const jsonContent = JSON.parse(fs.readFileSync(filePath));
      return [appPath, ...jsonContent];
    }
    if (fileType === 'text') {
      return [appPath, 'text', {
        value: fs.readFileSync(filePath).toString(),
      }];
    }

    return [appPath, fileType, {
      value: datauri(filePath).content,
    }];

  } catch(e) {
    return false;
  }
}
const getDirFiles = (dir) => fs.readdirSync(dir).filter(x => !['.gitkeep', '.files'].includes(x)).map(x => path.resolve(dir, x))

const calcListOfFiles = (dir) => {
  let expRet = [];
  let impRet = [];
  const files = getDirFiles(dir);
  files.forEach((filePath) => {
    const fsPath = path.resolve(dir, filePath);
    const fileObject = getFileObjectOfFsFile(fsPath);
    if (fileObject[1] === 'app') {
      const importName = getUniqueImportName(fsPath);
      fileObject.push({
        component: `%${importName}%`, // will remove %s when creating actual codes
      });
      impRet.push({
        name: importName,
        from: fsPath,
      });
    }
    expRet = [
      ...expRet,
      fileObject,
    ];
    if (fileObject[1] === 'directory') {
      const subList = calcListOfFiles(fsPath);
      impRet = [
        ...impRet,
        ...subList.impRet,
      ]
      expRet = [
        ...expRet,
        ...subList.expRet,
      ];
    }

  });
  return {
    impRet,
    expRet,
  };
}


export default () => ({
  name: 'files',
  transform(_src, id) {
    if (id.endsWith('.files')) {
      let codeImport = '';
      let codeExport = 'export default [';
      const files = calcListOfFiles(FILES_DIR);
      files.impRet.forEach(({name, from}) => {
        codeImport = `${codeImport}import ${name} from '${from}';\n`
      });
      files.expRet.forEach((fileObj) => {
        codeExport += `${JSON.stringify(fileObj).split('"%').join('').split('%"').join('')},`
      });
      codeExport += ']';
      return {
        map: null,
        code: `${codeImport}${codeExport}`,
      };
    }
  }
});
