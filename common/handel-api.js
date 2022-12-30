import axios from 'axios';
import logMessage from './log.js';
import {
  checkValidString,
  checkValidJSON
} from './utils.js';

const handelAPI = async (req, res, apiConfig) => {
  try {
    const apiConfigJSON = JSON.parse(apiConfig);
    const apiDef = getAPIDef(req, apiConfigJSON)
    if (apiDef) {
      const options = await getRequestOptions(req, apiDef, apiConfigJSON);
      const response = await axios(options);
      res.status(response.status).send(response.data);
      return;
    }
  } catch (e) {
    logMessage(e);
    res.status(500).send('Something broke!');
  }
  res.status(500).send('Something broke!');
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
    if (apiDef.hasOwnProperty('headers') && checkValidJSON(apiDef.headers)){
      headers = apiDef.headers;
    }
    const token = await setToken(req,apiDef,apiConfigJSON);
    if(token){
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
    if (apiDef.hasOwnProperty('dataMapping') && typeof apiDef.dataMapping && Object.keys(apiDef.dataMapping)) {
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
  let returnValue = null;
  try {
    if (apiDef.hasOwnProperty('accessTokenSetting') && (apiDef.accessTokenSetting === 'E' || apiDef.accessTokenSetting === 'C')) {
      switch (apiDef.accessTokenSetting) {
        case 'E':
          returnValue = getExistingToken(req, apiDef);
          break;
        case 'C':
          returnValue = await createToken(req, apiDef, apiConfigJSON);
          break;
        default:
          returnValue = null;
      }
    }
    return returnValue;
  } catch (e) {
    logMessage(e);
    return null;
  }

}

const getExistingToken = (req, apiDef) => {
  try {
    const tokenMapping = apiDef.tokenMapping;
    const tokenSuffix = (checkValidString(apiDef, 'tokenSuffix')) ? apiDef.tokenSuffix : '';
    const token = {};
    token[tokenMapping.MSKey] = `${tokenSuffix}${req.headers[tokenMapping.frontEndKey]}`;
    return token;
  } catch (e) {
    logMessage(e);
    return null;
  }
}

const createToken = async (apiDef, apiConfigJSON) => {
  try {
    const options = {
      url: apiConfigJSON.createTokenConfig.url,
      method: apiConfigJSON.createTokenConfig.method,
      data: apiConfigJSON.createTokenConfig.data,
      headers: apiConfigJSON.createTokenConfig.headers
    };
    const response = await axios(options);
    const tokenSuffix = (checkValidString(apiDef, 'tokenSuffix')) ? apiDef.tokenSuffix : '';
    const token = {};
    token[apiConfigJSON.createTokenConfig.tokenName] = `${tokenSuffix}${response[apiConfigJSON.createTokenConfig.tokenKey]}`;
    return token;
  } catch (e) {
    logMessage(e);
    return null;
  }
}

export default handelAPI;