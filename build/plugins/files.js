import path from 'path';
import fs from 'fs';
import { createHash } from 'crypto';
// eslint-disable-next-line import/no-extraneous-dependencies
import datauri from 'datauri/sync';

let FILES_DIR;

const getDirFiles = (dir) => fs.readdirSync(dir).filter((x) => !['.gitkeep', '.files'].includes(x)).map((x) => path.resolve(dir, x));

const realPathToAppPath = (thePath) => thePath.replace(`${FILES_DIR}/`, '');

const getFileHash = (thePath) => `x${createHash('md5').update(thePath).digest('hex')}`;

const getConvertDataType = (filePath) => {
  const appPath = realPathToAppPath(filePath);
  const extName = path.extname(appPath);
  if (['.gif', '.jpg', '.jpeg', '.png', '.mp3', '.wav', '.mp4', '.mkv', '.avi'].includes(extName)) { // url or datauri
    if (appPath.startsWith('C:')) {
      // legacy check to only make default wallaper datauri and not the other ones
      if (!appPath.startsWith('C:/Windows/system/wallpapers') || appPath === 'C:/Windows/system/wallpapers/01.jpg') {
        return 'datauri';
      }
    }
    return 'url';
  }
  if (extName === '.js') {
    return '';
  }
  return 'content';
};

const calculateFilesModule = () => {
  const imp = [];
  const exp = [];
  const loadFiles = (filePath) => {
    const files = getDirFiles(filePath);
    files.forEach((file) => {
      const stat = fs.lstatSync(file);
      const appPath = realPathToAppPath(file);
      if (stat.isDirectory()) {
        exp.push({
          type: 'directory',
          path: appPath,
        });
        loadFiles(file);
      } else {
        const varName = getFileHash(file);
        let fromText = file;
        if (!file.endsWith('.vue')) {
          const convertDataType = getConvertDataType(file);
          if (convertDataType === 'datauri') {
            fromText += '?datauri'; // handled by current plugin
          } else if (convertDataType === 'url') {
            fromText += '?url'; // handled by vite
          } else if (convertDataType === 'content') {
            fromText += '?raw'; // handled by vite
          } else {
            exp.push({
              type: 'file',
              path: appPath,
              data: `'${fs.readFileSync(file)
                .toString()
                .split('\'')
                .join('\\\'')
                .split('\n')
                .join('\\n')}'`,
            });
            return;
          }
        }
        imp.push({
          name: varName,
          from: fromText,
        });
        exp.push({
          type: file.endsWith('.vue') ? 'app' : 'file',
          path: appPath,
          data: varName,
        });
      }
    });
  };
  loadFiles(FILES_DIR);

  let code = '';
  // handle imports
  code += imp
    .map(
      (impItem) => `import ${impItem.name} from '${impItem.from}';`,
    )
    .join(' ');
  // handle export
  code += 'export default [';
  code += exp.map((expItem) => `
    {
      type: '${expItem.type}',
      path: '${expItem.path}',
      data: ${expItem.data}
    }
  `).join(',');
  code += ']';

  return {
    code,
    map: null,
  };
};

export default () => ({
  name: 'files',
  transform(src, id) {
    if (id.endsWith('.files')) {
      FILES_DIR = path.dirname(id);
      const { code, map } = calculateFilesModule();
      return {
        code,
        map,
      };
    }
    if (/\?datauri$/.test(id) && src.length < 300) {
      return {
        map: null,
        code: `export default '${datauri(id.replace('?datauri', '')).content}';`,
      };
    }
    return null;
  },
});
