import fs from 'fs';
import path,{ dirname } from 'path';
import { fileURLToPath } from 'url';
import logMessage from './log.js';
function checkValidString(jsonObject, key){
    return jsonObject && key && jsonObject.hasOwnProperty(key) && typeof jsonObject[key]&& jsonObject[key].length
}


function getFileContent(filename,dir){
    try {
        let fileNameWithPath = `${dir}${filename}`;
        const __dirname = dirname(fileURLToPath(fileNameWithPath));
        const tempPath = path.join(__dirname,filename);
        const apiConfig = fs.readFileSync(tempPath, 'utf8');
        return apiConfig; 
    } catch (error) {
        logMessage(`API configuration validation ${error}`); 
    }
    return null;
}


export {checkValidString, getFileContent} 