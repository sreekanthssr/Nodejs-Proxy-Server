import fs from 'fs';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import logMessage from './log.js';

export default async function getAPIConfig() {
  try {
    const fileName = process.env.API_CONFIG_FILE;
    if(fileName){
      const fileExtension = fileName.split('.').pop().toLowerCase();
      switch(fileExtension){
        case 'js':
          return await readJSFile(fileName);
        case 'json':
          return readJsonFile(fileName);
        default:
         logMessage(`API configuration File -type not supported`);
      }
    } else {
      logMessage(`API configuration File -missing`);
    }    
  } catch (error) {
    logMessage(`API configuration File -${error}`);
  }

}

const readJsonFile = (fileName) => {
  try {
    const __dirname = dirname(fileURLToPath(
      import.meta.url));
    const apiConfigFileName = path.join(__dirname, `./../${fileName}`);
    const apiConfig = fs.readFileSync(apiConfigFileName, 'utf8');
    return JSON.parse(apiConfig);
  } catch (error) {
    logMessage(`API configuration File -${error}`);
  }
  return null;
}

const readJSFile = async (fileName) =>{
  try{
    const __dirname = dirname(fileURLToPath(
    import.meta.url));
    const apiConfigFileName = path.join(__dirname, `./../${fileName}`);
    return (await import(apiConfigFileName)).default;
  } catch(error){
    logMessage(`API configuration File -${error}`);
  }
  return null;
  
}