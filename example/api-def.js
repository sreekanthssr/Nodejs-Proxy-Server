import dotenv from 'dotenv';
dotenv.config();

const apiDef = {
  "version": "1.0.0",
  "baseURL": process.env.BASE_URL || "http://localhost:3001",
  "createTokenConfig": {
    "url":"http://localhost:3001/auth",
    "headers":{"sdf":"sdf"},
    "methode":"get",
    "tokenKey":"tokenName",
    "tokenName":"Bearrr",
    "data":"{user:\"ads\"}",
    "tokenPrefix":"1234"
  },
  "preCommonFunction": "commonPre",
  "preCommonScriptFile": "./example/custom-scripts/common-pre.js",
  "postCommonFunction": "commonPost",
  "postCommonScriptFile": "./example/custom-scripts/common-pre.js",
  "apis": [{
    "type": "get",
    "path": "/user",
    "microserviceURL": "/getCustomer",
    "microserviceType" : "get",
    "responseType": "json",
    "appendBasePath": true,
    "accessTokenSetting": "E",
    "tokenMapping": {"frontEndKey":"token", "MSKey":"bearerToken"},
    "dataMapping": {
      "name": "username",
      "email": "emailId"
    },
    "queryParam" : {
      "name": "username",
      "email": "emailId"
    },
    "headers":{"a":1},
    "executeCommonPreFunction": true,
    "executeCommonPostFunction": true,
    "preScriptType":"C",
    "preScriptFile":"./example/custom-scripts/preScript.js",
    "postScriptType":"C",
    "postScriptFile":"./example/custom-scripts/postScript.js",
    "preScriptFunction":"APIcommonPre",
    "postScriptFunction":"APIcommonPost",
    "tokenPrefix": "Bearer"
  }]
}
export default apiDef;