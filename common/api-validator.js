import logMessage from './log.js';
export default function valiateAPIConfig(apiConfig){
    if(!basicValidator(apiConfig)){
        return false;
    }
    return true;
}

function basicValidator(apiConfig){
    let message = "";
    let flag = true;
    try{
        const apiConfigJSON = JSON.parse(apiConfig);
        if(apiConfigJSON){
            if(!apiConfigJSON.hasOwnProperty("version")){
                message = "Version is missing \n";
                flag = false;
            }
            if(!apiConfigJSON.hasOwnProperty("baseURL")){
                message = "Base URL is missing \n";
                flag = false;
            }
            if(!apiConfigJSON.hasOwnProperty("apis")){
                message = "APIs is missing \n";
                flag = false;
            } else if(!apiConfigJSON.apis.length) {
                message = "No API definition found \n";
                flag = false;
            }        
        }
    } catch (e){
        logMessage(`Basic validation failed ${e}`);
        return false;
    }
    logMessage(message);
    return flag;
}
