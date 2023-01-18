import fs from 'fs';
import path, {
  dirname
} from 'path';
import {
  fileURLToPath
} from 'url';
import logMessage from './log.js';

const checkValidString = (jsonObject, key) => {
  return !!(jsonObject && key && jsonObject.hasOwnProperty(key) && typeof jsonObject[key] && jsonObject[key].length)
}


const getFileContent = (filename, dir="") => {
  try {
    let fileNameWithPath = `${dir}${filename}`;
    const __dirname = dirname(fileURLToPath(
      import.meta.url));
    fileNameWithPath = path.join(__dirname, `./../${fileNameWithPath}`);
    //const tempPath = path.join(__dirname, filename);
    const apiConfig = fs.readFileSync(fileNameWithPath, 'utf8');
    return apiConfig;
  } catch (error) {
    logMessage(`API configuration validation ${error}`);
  }
  return null;
}

const checkValidJSON = (object) => {
  let flag = false;
  try {
    if(object){
      let temp = null;
      switch (typeof object) {
        case 'string':
          temp = JSON.parse(object);
          flag = true;
          break;
        case 'object':
          temp = JSON.parse(JSON.stringify(object));
          flag = true;
          break;
        default: 
         flag = false;
      }
      return flag;
    } 
    return flag;
  } catch (e) {
    logMessage(e);
    return false;
  }
}
const getAbsoultFileWPath = (fileName) =>{
  const __dirname = dirname(fileURLToPath(import.meta.url));
  return path.join(__dirname, `./../${fileName}`);
}

export {
  checkValidString,
  getFileContent,
  checkValidJSON,
  getAbsoultFileWPath
}