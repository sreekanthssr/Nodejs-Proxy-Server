import fs from 'fs';
import logMessage from './log.js';
import { getAbsoultFileWPath } from "./utils.js";

export default async function getAPIConfig(fileName) {
  try {
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
    const apiConfigFileName = getAbsoultFileWPath(fileName);
    const apiConfig = fs.readFileSync(apiConfigFileName, 'utf8');
    return JSON.parse(apiConfig);
  } catch (error) {
    logMessage(`API configuration File -${error}`);
  }
  return null;
}

const readJSFile = async (fileName) =>{
  try{
    const apiConfigFileName = getAbsoultFileWPath(fileName);
    return (await import(apiConfigFileName)).default;
  } catch(error){
    logMessage(`API configuration File -${error}`);
  }
  return null;  
}


