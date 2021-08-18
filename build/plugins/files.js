import path from 'path';
import fs from 'fs';
import { createHash } from 'crypto';
// eslint-disable-next-line import/no-extraneous-dependencies
import datauri from 'datauri/sync';

const FILES_DIR = path.resolve(__dirname, '../../files');
const DIST_DIR = path.resolve(__dirname, '../../dist');
let filesResult;
let isDev = true;

const urlFiles = ['.jpg', '.jpeg', '.png', '.mp3', '.wav'];

const getDirFiles = (dir) => fs.readdirSync(dir).filter((x) => !['.gitkeep', '.files'].includes(x)).map((x) => path.resolve(dir, x));

const realPathToAppPath = (thePath) => thePath.replace(`${FILES_DIR}/`, '');

const getFileHash = (thePath) => `x${createHash('md5').update(thePath).digest('hex')}`;

const calculateFilesModule = () => {
  const imp = [];
  const exp = [];
  const copyLater = [];
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
        const fromText = file;
        if (!file.endsWith('.vue')) {
          const copyFileName = `${varName}${path.extname(file)}`;
          copyLater.push({
            src: file,
            dst: path.resolve(DIST_DIR, copyFileName),
          });
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
    imp,
    exp,
    code,
    map: null,
    copyLater,
  };
};

const handleFileCode = (file) => {
  const filePath = file.replace('?file', '');
  const stats = fs.statSync(filePath);
  const varName = getFileHash(filePath);
  const url = isDev || stats.size < (1024 * 160) ? datauri(filePath).content : `${varName}${path.extname(filePath)}`;
  let code = 'export default ';
  if (urlFiles.includes(path.extname(file))) {
    code += `'${url}'`;
  } else {
    const content = fs.readFileSync(filePath).toString().trim();
    code += `\`${content}\``;
  }
  code += ';';
  return {
    map: null,
    code,
  };
};

export default () => ({
  name: 'files',
  buildStart(options) {
    isDev = !options.input;
  },
  transform(_src, id) {
    if (id.endsWith('.files')) {
      filesResult = calculateFilesModule();
      return {
        map: filesResult.map,
        code: filesResult.code,
      };
    }

    const copyLater = filesResult && filesResult.copyLater.find((x) => x.src === id);
    if (copyLater) {
      const result = handleFileCode(id);
      return {
        map: result.map,
        code: result.code,
      };
    }
    return null;
  },
  buildEnd() {
    setTimeout(() => {
      if (filesResult) {
        filesResult.copyLater.forEach(({ src, dst }) => {
          fs.mkdirSync(path.dirname(dst), { recursive: true });
          fs.copyFileSync(src, dst);
        });
      }
    });
  },
});
