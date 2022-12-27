import logMessage from './log.js';
import validUrl from 'valid-url';
import vm from 'vm';
import { checkValidString, getFileContent} from './utils.js';
export default function valiateAPIConfig(apiConfig){
    try{
        const apiConfigJSON = JSON.parse(apiConfig);
        if(!basicValidator(apiConfigJSON)){
            return false;
        }
        if(!validateAPIs(apiConfigJSON)){          
            return false;
        }
    } catch(e){
        logMessage(`API configuration validation ${e}`);
        return false;
    }  
    return true;  
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
            if(!validUrl.isUri(apiConfigJSON.baseURL)){
                message = `${message}Invalid baseURL \n`;
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
    !flag && logMessage(message);
    return flag;
}
function validateAPIs(apiConfigJSON){
    let flag = true;
    let message = "";
    try{
        apiConfigJSON.apis.forEach((apiDef,i) => {
            if(!checkType(apiDef.type)){
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
            if(!checkType(apiDef.microserviceType)){
                flag = false;
                message = `${message}API-${i} : Type not supported`;
            }
            //Need to put validator for microserviceResponseType
            if(!checkScriptType(apiDef,'pre',apiConfigJSON)){
                flag = false;
                message = `${message}API-${i} : Invalid pre script type or missing info`;
            }
            if(!checkScriptType(apiDef,'post',apiConfigJSON)){
                flag = false;
                message = `${message}API-${i} : Invalid post script type or missing info`;
            }//checkValidString(apiDef,'accessTokenSetting') &&
            if( checkTokenSetting(apiDef.accessTokenSetting,apiDef,apiConfigJSON)){ }
            else {
                flag = false;
                message = `${message}API-${i} : Invalid token setting`;  
            }   
            if(apiDef.hasOwnProperty('tokenSuffix')){
                if(typeof apiDef.tokenSuffix != "string"){
                    flag = false;
                    message = `${message}API-${i} : Invalid tokenSuffix`; 
                }
            } 
            if(apiDef.hasOwnProperty('tokenSmappinguffix')){
                if(typeof apiDef.tokenSuffix != "object"){
                    flag = false;
                    message = `${message}API-${i} : Invalid tokenSuffix`; 
                }
            }     
        });
    } catch(e){
        logMessage(`API validation failed ${e}`);
        return false;
    }
    !flag && logMessage(message);
    return flag;
}
function checkType(type){
    const supportedAPITypes = ['post','get','put','delete'];
    return type && supportedAPITypes.includes(type.toLowerCase())
}
function checkPath(apiDef){
    return apiDef.path && apiDef.path.length && typeof apiDef.path == "string";
}
function checkMicroserviceURL(apiDef){
    return apiDef.path && apiDef.path.length && typeof apiDef.path == "string";
}
function checkScriptType(apiDef, prefix, apiConfigJSON){
    let flag = true;    
    try {
        const scriptType = apiDef[`${prefix}ScriptType`];
        const scriptFunction = apiDef[`${prefix}ScriptFunction`];
        const scriptFile = apiDef[`${prefix}ScriptFile`];
        if(scriptType){
            switch(scriptType){
                case 'C':
                    flag = checkCommonFunction(apiConfigJSON,scriptFunction);
                    break;
                case 'F':
                    flag = checkScript(scriptFile);
                    break;
                default:
                    flag = true;
            }
        }        
    } catch (e) {
        logMessage(`Validation error in script ${e}`);
        return false;
    }
    return flag;    
}
function checkCommonFunction(apiConfigJSON,scriptFunction,prefix){
    let flag = true;
    try{
        let key = `${prefix}ScriptFile`;
        if(checkValidString(apiConfigJSON,key)){
            let commonFileContent = getFileContent(apiConfigJSON[key]);
            if(!commonFileContent.includes(scriptFunction)){
               flag = false;
               logMessage(`${apiConfigJSON[key]} file not have ${scriptFunction}`); 
            }
        } else {
            logMessage(`${apiConfigJSON[key]} file not exists`); 
        }
    }catch(e){
        logMessage(`Validation error in script ${e}`);
        return false;
    }
    return flag;
}
function checkScript(scriptFile){
    if(scriptInput){
        try {
            let scriptFileContent = getFileContent(scriptFile);
            const scriptValidation = new vm.Script(scriptFileContent);
        } catch (e) {
            logMessage(`${scriptFile} have error ${e}`);
            return false;
        }
    }
    return true;
}
function checkTokenSetting(accessTokenSetting,apiDef,apiConfigJSON){
    let flag = true;
    try {
        switch(accessTokenSetting){
            case 'E':
                if(!checkTokenMapping(apiDef)){
                    flag = false;
                    logMessage(`Please provide token maping in JSON format`);
                }
                break;
            case 'C':
                if((apiConfigJSON.hasOwnProperty('createTokenConfig') && typeof apiConfigJSON.createTokenConfig == 'object') && checkTokenCreateSetting(apiConfigJSON.createTokenConfig) && 
                checkTokenMapping(apiDef)){}
                else{
                    flag = false;
                    logMessage(`Please provide valid token genration setting`);
                }
                break;
            default:
                flag = true;
        }
    } catch (e) {
        logMessage(`Error in accessTokenSetting ${e}`);
        return false;
    }
    return flag;
}
function checkTokenCreateSetting(createTokenConfig){
    try {
        if(checkValidString(createTokenConfig,'url') && checkValidString(createTokenConfig,'methode') && createTokenConfig.hasOwnProperty('header') && typeof createTokenConfig.header == 'object'){
            return true;
        }
        logMessage(`Please provide valid token setup`);
    } catch (e) {
        logMessage(`Error in accessTokenSetting ${e}`);
        return false;
    }
    return false;
}
function checkTokenMapping(apiDef){
    try {
        if(apiDef.hasOwnProperty('tokenMapping') && typeof apiDef.tokenMapping == 'object'){} 
        else {
            logMessage(`Please provide token maping in JSON format`);
            return false;
        }
    } catch (e) {
        logMessage(`Error in tokenMapping ${e}`);
        return false; 
    }
    return true;
}
