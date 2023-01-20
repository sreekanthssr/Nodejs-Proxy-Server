import axios from 'axios';
import logMessage from './log.js';
import {
  checkValidString,
  checkValidJSON,
  getAbsoultFileWPath
} from './utils.js';

import apiResponse from './api-response.js';

const handelAPI = async (req, res, apiConfigJSON) => {
  try {
    const apiDef = getAPIDef(req, apiConfigJSON);
    if (apiDef) {
      let options = await getRequestOptions(req, apiDef, apiConfigJSON);
      options = await excutePreScript(apiDef, apiConfigJSON, options, req);
      let microServiceResponse = await axios(options);
      microServiceResponse = await excutePostScript(apiDef, apiConfigJSON, req, res, microServiceResponse);
      return res.status(microServiceResponse.status).send(microServiceResponse.data);
    } else {
      apiResponse.send404(res);
    }
  } catch (e) {
    logMessage(e);
    return apiResponse.send500(res);
  }
  return apiResponse.send500(res);
}

const getAPIDef = (req, apiDef) => {
  try {
    return apiDef.apis.find(api => {
      return api.type.toLowerCase() === req.method.toLowerCase() && api.path === req.url;
    });
  } catch (e) {
    logMessage(e);
    return null;
  }
}
const getRequestURL = (apiDef, apiConfig) => {
  try {
    let url = '';
    if (apiDef.hasOwnProperty('appendBasePath') && apiDef.appendBasePath === false) {} else {
      url = apiConfig.baseURL;
    }
    return `${url}${apiDef.microserviceURL}`;
  } catch (e) {
    logMessage(e);
    return null;
  }
}

const getRequestOptions = async (req, apiDef, apiConfigJSON) => {
  try {
    const url = getRequestURL(apiDef, apiConfigJSON);
    const method = apiDef.microserviceType;
    let headers = {};
    if (apiDef.hasOwnProperty('headers') && checkValidJSON(apiDef.headers)) {
      headers = apiDef.headers;
    }
    const token = await setToken(req, apiDef, apiConfigJSON);
    if (token) {
      headers = {
        ...headers,
        ...token
      }
    }
    let options = {
      method,
      url,
      headers,
      responseType: apiDef.microserviceResponseType
    };
    if (method.toLowerCase() !== 'get') {
      let data = formatePostData(req.body, apiDef);
      options['data'] = data;
    }
    return options;
  } catch (e) {
    logMessage(e);
    return null;
  }

}

const formatePostData = (postData, apiDef) => {
  try {
    if (apiDef.hasOwnProperty('dataMapping') && Object.keys(apiDef.dataMapping)) {
      let data = {};
      for (const key in apiDef.dataMapping) {
        const msKey = apiDef.dataMapping[key];
        data[msKey] = postData[key];
      }
      return data;
    }
    return postData;
  } catch (e) {
    logMessage(e);
    return null;
  }

}

const setToken = async (req, apiDef, apiConfigJSON) => {
  try {
    if (apiDef.hasOwnProperty('accessTokenSetting')) {
      switch (apiDef.accessTokenSetting) {
        case 'E':
          return getExistingToken(req, apiDef);
        case 'C':
          return await createToken(apiDef, apiConfigJSON);
        default:
          return null;
      }
    }
    return null;
  } catch (e) {
    logMessage(e);
    return null;
  }

}

const getExistingToken = (req, apiDef) => {
  try {
    const tokenMapping = apiDef.tokenMapping;
    const tokenPrefix = (checkValidString(apiDef, 'tokenPrefix')) ? apiDef.tokenPrefix : '';
    const token = {};
    token[tokenMapping.MSKey] = `${tokenPrefix}${req.headers[tokenMapping.frontEndKey]}`;
    return token;
  } catch (e) {
    logMessage(e);
    return null;
  }
}

const createToken = async (apiDef, apiConfigJSON) => {
  try {
    const method = apiConfigJSON.createTokenConfig?.methode || 'post';
    const data = apiConfigJSON.createTokenConfig?.data || {};
    const options = {
      url: apiConfigJSON.createTokenConfig.url,
      method,
      data,
      headers: apiConfigJSON.createTokenConfig.headers
    };
    const response = await axios(options);
    const tokenPrefix = (checkValidString(apiConfigJSON.createTokenConfig, 'tokenPrefix')) ? apiConfigJSON.createTokenConfig.tokenPrefix : '';
    const token = {};
    token[apiConfigJSON.createTokenConfig.tokenName] = `${tokenPrefix}${response.data[apiConfigJSON.createTokenConfig.tokenKey]}`;
    return token;
  } catch (e) {
    logMessage(e);
    return null;
  }
}

const excutePreScript = async (apiDef, apiConfigJSON, options, req) => {
  try {
    let updatedOptions = {...options};
    if(apiDef.hasOwnProperty('excuteCommonPreFunction') && apiDef.excuteCommonPreFunction === false){}
    else {
      const commonFunction = await getCommonFunction(apiConfigJSON, 'pre');
      updatedOptions = await (commonFunction) ? commonFunction (updatedOptions, req): updatedOptions;
    }    
    const excutionFunction = await getExcutionFunction(apiDef, apiConfigJSON, 'pre');    
    return await (excutionFunction) ? excutionFunction(updatedOptions, req) : updatedOptions;
  } catch (e) {
    logMessage(e);
    return options;
  }
}
const excutePostScript = async (apiDef, apiConfigJSON, req, res, microServiceResponse) => {
  try {
    const excutionFunction = await getExcutionFunction(apiDef, apiConfigJSON, 'post');
    let updatedMSResponse =  await (excutionFunction) ? excutionFunction(req, res, {...microServiceResponse}) : {...microServiceResponse};
    if(apiDef.hasOwnProperty('excuteCommonPostFunction') && apiDef.excuteCommonPostFunction === false){}
    else {
      const commonFunction = await getCommonFunction(apiConfigJSON, 'post');
      updatedMSResponse = await (commonFunction) ? commonFunction(req, res, {...updatedMSResponse}): {...updatedMSResponse};
    } 
    return updatedMSResponse;
  } catch (e) {
    logMessage(e);
    return microServiceResponse;
  }
}

const getExcutionFunction = async (apiDef, apiConfigJSON, prefix) =>{
  try {    
    const scriptType = apiDef.hasOwnProperty(`${prefix}ScriptType`) ? apiDef[`${prefix}ScriptType`] : null;
    let fileName = null;
    let fileContent = null
    switch(scriptType){
      case 'F':
        fileName = getAbsoultFileWPath(apiDef[`${prefix}ScriptFile`]);
        fileContent = await import(fileName);
        return fileContent.default || null;
      case 'C':
        fileName = getAbsoultFileWPath(apiConfigJSON[`${prefix}CommonScriptFile`]);
        const functionName = apiDef[`${prefix}ScriptFunction`];
        fileContent = await import(fileName);
        return fileContent[functionName] || null;
      default:
        return null;
    }
  } catch (e) {
    logMessage(e);
    return null;
  }
}

const getCommonFunction = async (apiConfigJSON, prefix) =>{
  try {
    const functionName = apiConfigJSON[`${prefix}CommonFunction`];
    if(functionName){
      const fileName = getAbsoultFileWPath(apiConfigJSON[`${prefix}CommonScriptFile`]);
      const fileContenet = await import(fileName);
      return fileContenet[functionName] || null;
    }
    return null;
  } catch (e) {
    logMessage(e);
    return null;
  }
}

export default handelAPI;