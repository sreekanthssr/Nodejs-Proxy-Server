import logMessage from './log.js';
import validUrl from 'valid-url';
import vm from 'vm';
import {
  checkValidString,
  getFileContent,
  checkValidJSON
} from './utils.js';
export default function valiateAPIConfig(apiConfigJSON) {
  try {
    if (!basicValidator(apiConfigJSON)) {
      return false;
    }
    if (!optionalConfigValidation(apiConfigJSON)) {
      return false;
    }
    if (!validateAPIs(apiConfigJSON)) {
      return false;
    }
  } catch (e) {
    logMessage(`API configuration validation ${e}`);
    return false;
  }
  return true;
}

function basicValidator(apiConfigJSON) {
  let message = "";
  let flag = true;
  try {
    if (apiConfigJSON) {
      if (!apiConfigJSON.hasOwnProperty('version')) {
        message = "Version is missing \n";
        flag = false;
      }
      if (!apiConfigJSON.hasOwnProperty('baseURL')) {
        message = `${message}Base URL is missing \n`;
        flag = false;
      } else if (!validUrl.isUri(apiConfigJSON.baseURL)) {
        message = `${message}Invalid baseURL \n`;
        flag = false;
      }
      if (!apiConfigJSON.hasOwnProperty('apis')) {
        message = `${message}APIs is missing \n`;
        flag = false;
      } else if (!Array.isArray(apiConfigJSON.apis)) {
        message = `${message}API definition sould be an Array \n`;
        flag = false;
      } else if (!apiConfigJSON.apis.length) {
        message = `${message}No API definition found \n`;
        flag = false;
      }
    }
  } catch (e) {
    logMessage(`Basic validation failed ${e}`);
    return false;
  }!flag && logMessage(message);
  return flag;
}

function optionalConfigValidation(apiConfigJSON) {
  let message = "";
  let flag = true;
  try {
    if (apiConfigJSON) {
      const checkPreCommon = checkCommonFunction(apiConfigJSON, 'pre');
      if(checkPreCommon === true){
        flag =  true;
      } else {
        message = `${message} Please check pre script file and pre script function\n`;
        flag = false;
      }
      const checkPostCommon = checkCommonFunction(apiConfigJSON, 'post');
      if(checkPostCommon === true){
        flag =  true;
      } else {
        message = `${message} Please check post script file and pre script function\n`;
        flag = false;
      }
    }
  } catch (e) {
    logMessage(`Optional Config Validation failed ${e}`);
    return false;
  }
  !flag && logMessage(message);
  return flag;
}

function validateAPIs(apiConfigJSON) {
  let flag = true;
  let message = "";
  try {
    apiConfigJSON.apis.forEach((apiDef, i) => {
      if (!checkType(apiDef.type)) {
        flag = false;
        message = `${message}API-${i} : Type not supported\n`;
      }
      if (!checkPath(apiDef)) {
        flag = false;
        message = `${message}API-${i} : Should be valid path\n`;
      }
      if (!checkMicroserviceURL(apiDef)) {
        flag = false;
        message = `${message}API-${i} : Should be valid microserviceURL\n`;
      }
      if (!checkType(apiDef.microserviceType)) {
        flag = false;
        message = `${message}API-${i} : Microservice type not supported\n`;
      }
      if (apiDef.hasOwnProperty('microserviceResponseType') && !checkResponseType(apiDef.microserviceResponseType)) {
        flag = false;
        message = `${message}API-${i} : Microservice Response Type type not supported\n`;
      }
      const preScriptCheck = checkScriptType(apiDef, 'pre', apiConfigJSON)
      if (preScriptCheck === true) {} else {
        flag = false;
        message = `${message}API-${i} :${preScriptCheck}\n`;
      }
      const postScriptCheck = checkScriptType(apiDef, 'post', apiConfigJSON)
      if (postScriptCheck === true) {} else {
        flag = false;
        message = `${message}API-${i} : ${postScriptCheck}\n`;
      } //checkValidString(apiDef,'accessTokenSetting') &&
      const tokenValidation = checkTokenSetting(apiDef.accessTokenSetting, apiDef, apiConfigJSON)
      if (tokenValidation === true) {} else {
        flag = false;
        message = `${message}API-${i} : Invalid token setting\n${tokenValidation}`;
      }
      if (apiDef.hasOwnProperty('tokenSuffix')) {
        if (typeof apiDef.tokenSuffix != "string") {
          flag = false;
          message = `${message}API-${i} : Invalid tokenSuffix\n`;
        }
      }
      if (apiDef.hasOwnProperty('dataMapping')) {
        if (!checkValidJSON(apiDef.dataMapping)) {
          flag = false;
          message = `${message}API-${i} : Invalid Data Mapping. Should be in JSON`;
        }
      }
      if (apiDef.hasOwnProperty('headers')) {
        if (!checkValidJSON(apiDef.headers)) {
          flag = false;
          message = `${message}API-${i} : Invalid Headers. Should be in JSON`;
        }
      }
    });
  } catch (e) {
    logMessage(`API validation failed ${e}`);
    return false;
  }!flag && logMessage(message);
  return flag;
}

function checkType(type) {
  const supportedAPITypes = ['post', 'get', 'put', 'delete'];
  return type && supportedAPITypes.includes(type.toLowerCase());
}

function checkResponseType(type) {
  const supportedResponseType = ['arraybuffer', 'document', 'json', 'text', 'stream'];
  return type && supportedResponseType.includes(type.toLowerCase());
}

function checkPath(apiDef) {
  return apiDef.path && apiDef.path.length && typeof apiDef.path == "string";
}

function checkMicroserviceURL(apiDef) {
  return apiDef.microserviceURL && apiDef.microserviceURL.length && typeof apiDef.microserviceURL == "string";
}

function checkScriptType(apiDef, prefix, apiConfigJSON) {
  try {
    const scriptType = apiDef[`${prefix}ScriptType`];
    const scriptFunction = apiDef[`${prefix}ScriptFunction`];
    const scriptFile = apiDef[`${prefix}ScriptFile`];
    switch (scriptType) {
      case 'C':
        return checkCommonFile(apiConfigJSON, scriptFunction, prefix);
      case 'F':
        return checkScript(scriptFile, prefix);
      default:
        return true;
    }
  } catch (e) {
    return `Validation error in script ${e}`;
  }
}

function checkCommonFile(apiConfigJSON, scriptFunction, prefix) {
  try {
    let key = `${prefix}ScriptFile`;
    if (checkValidString(apiConfigJSON, key)) {
      if (scriptFunction && typeof scriptFunction === "string") {} else {
        return `Enter valid ${prefix}ScriptFunction`;
      }
      let commonFileContent = getFileContent(apiConfigJSON[key]);
      if (commonFileContent.includes(scriptFunction)) {
        return true;
      } else {
        return `${apiConfigJSON[key]} file not have ${scriptFunction}`;
      }
    } else {
      return `Common ${prefix}ScriptFile file path missing`;
    }
  } catch (e) {
    return `Validation error in ${prefix}ScriptFile ${e}`;
  }
}

function checkScript(scriptFile, prefix, functionName = null) {
  try {
    if (scriptFile && typeof scriptFile === "string") {
      let scriptFileContent = getFileContent(scriptFile);
      if(functionName){
        if(!scriptFileContent.includes(functionName)){
          return `${prefix}ScriptFile function missing`
        }
      }
      const scriptValidation = new vm.Script(scriptFileContent);
      return true;
    } else {
      return `${prefix}ScriptFile missing`;
    }
  } catch (e) {
    return `${scriptFile} have error ${e}`;
  }
}
//****token key should validate */
function checkTokenSetting(accessTokenSetting, apiDef, apiConfigJSON) {
  try {
    switch (accessTokenSetting) {
      case 'E':
        if (!checkTokenMapping(apiDef)) {
          return `Please provide token maping in JSON format`;
        }
        return true;
      case 'C':
        if ((apiConfigJSON.hasOwnProperty('createTokenConfig') && typeof apiConfigJSON.createTokenConfig == 'object')) {
          const checkTokenConfig = checkTokenCreateSetting(apiConfigJSON.createTokenConfig);
          if (checkTokenConfig === true) {
            return true;
          }
          return checkTokenConfig;
        } else {
          return `Please provide valid token genration setting`;
        }
        default:
          return true;
    }
  } catch (e) {
    return `Error in accessTokenSetting ${e}`;
  }
}

function checkTokenCreateSetting(createTokenConfig) {
  try {
    if (checkValidString(createTokenConfig, 'url') && checkValidString(createTokenConfig, 'methode') && createTokenConfig.hasOwnProperty('headers') && typeof createTokenConfig.headers == 'object') {
      return true;
    }
    return `Please provide valid token setup`;
  } catch (e) {
    return `Error in accessTokenSetting ${e}`;
  }
}

function checkTokenMapping(apiDef) {
  try { //Validate keys
    if (apiDef.hasOwnProperty('tokenMapping') && typeof apiDef.tokenMapping == 'object') {} else {
      return false;
    }
  } catch (e) {
    logMessage(`Error in tokenMapping ${e}`);
    return false;
  }
  return true;
}

function checkCommonFunction(apiConfigJSON, prefix){
  try{
    const commonFunction = apiConfigJSON.hasOwnProperty(`${prefix}CommonFunction`) ? apiConfigJSON[`${prefix}CommonFunction`] : null;
    if(commonFunction){
      const commonScriptFile = apiConfigJSON.hasOwnProperty(`${prefix}ScriptFile`) ? apiConfigJSON[`${prefix}ScriptFile`] : null;
      if(commonScriptFile){
        return checkScript(commonScriptFile, prefix, commonFunction);
      } else {
        return `Not a valid ${prefix} script file`;
      }
    }
  } catch(e){
    logMessage(`Error in ${prefix} common function ${e}`);
    return false;
  }
  return true;
}