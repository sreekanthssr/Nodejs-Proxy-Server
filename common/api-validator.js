import logMessage from './log.js';
import validUrl from 'valid-url';
import vm from 'vm';
export default function valiateAPIConfig(apiConfig){
    try{
        const apiConfigJSON = JSON.parse(apiConfig);
        if(!basicValidator(apiConfigJSON)){
            return false;
        }
        return true;
    } catch(e){
        logMessage(`API validation ${e}`);
        return false;
    }
    
}

function basicValidator(apiConfigJSON){
    let message = "";
    let flag = true;
    try{
        
        if(apiConfigJSON){
            if(!apiConfigJSON.hasOwnProperty("version")){
                message = "Version is missing \n";
                flag = false;
            }
            if(!apiConfigJSON.hasOwnProperty("baseURL")){
                message = `${message}Base URL is missing \n`;
                flag = false;
            }
            if(!validUrl.isUri(apiConfigJSONbaseURL)){
                message = `${message}Base URL is missing \n`;
                flag = false;
            }
            if(!apiConfigJSON.hasOwnProperty("apis")){
                message = `${message}APIs is missing \n`;
                flag = false;
            } else if(!apiConfigJSON.apis.length) {
                message = `${message}No API definition found \n`;
                flag = false;
            }        
        }
    } catch (e){
        logMessage(`Basic validation failed ${e}`);
        return false;
    }
    flag && logMessage(message);
    return flag;
}

function validateAPIs(apiConfigJSON){
    let flag = true;
    let message = "";
    try{
        apiConfigJSON.forEach((apiDef,i) => {
            if(!checkType(apiDef)){
                flag = false;
                message = `${message}API-${i} : Type not supported`;
            }
            if(!checkPath(apiDef)){
                flag = false;
                message = `${message}API-${i} : Should be valid path`;
            }
            if(!checkMicroserviceURL(apiDef)){
                flag = false;
                message = `${message}API-${i} : Should be valid microserviceURL`;
            }
            if(!checkScript(apiDef.preScript)){
                flag = false;
                message = `${message}API-${i} : Error in the preScript`;
            }
            if(!checkScript(apiDef.postScript)){
                flag = false;
                message = `${message}API-${i} : Error in the postScript`;
            }
        });
    } catch(e){
        logMessage(`API validation failed ${e}`);
        return false;
    }
    flag && logMessage(message);
    return flag;
}

function checkType(apiDef){
    const supportedAPITypes = ['post','get','put','delete'];
    return apiDef.type && supportedAPITypes.includes(apiDef.type.toLowerCase())
}

function checkPath(apiDef){
    return apiDef.path && apiDef.path.length && typeof apiDef.path == "string";
}
function checkMicroserviceURL(apiDef){
    return apiDef.path && apiDef.path.length && typeof apiDef.path == "string";
}
function checkScript(scriptInput){
    if(scriptInput){
        try {
            const scriptValidation = new vm.Script(scriptInput);
        } catch (error) {
            logMessage(`Validation error in script ${e}`);
            return false;
        }
    }
    return true;
}
