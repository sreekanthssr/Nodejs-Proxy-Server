const apiDef = {
  "version": "1.0.0",
  "baseURL": "http://localhost:3001",
  "createTokenConfig": {
    "url":"http://localhost:3001/auth",
    "headers":{"sdf":"sdf"},
    "methode":"get",
    "tokenKey":"tokenName",
    "tokenName":"Bearrr",
    "data":'{user:"ads"}',
    "tokenSuffix":"1234"
  },
  "preCommonFunction": "commonPre",
  "preScriptFile": "./common-pre.js",
  "postCommonFunction": "commonPost",
  "postScriptFile": "./common-pre.js",
  apis: [{
    "type": "post",
    "path": "/user",
    "microserviceURL": "/getCustomer",
    "microserviceType" : "POST",
    "responseType": "json",
    "appendBasePath": true,
    "accessTokenSetting": "E",//C or E
    "tokenMapping": {"frontEndKey":"token", "MSKey":"bearerToken"},
    "dataMapping": {
      "name": "username",
      "email": "emailId"
    },
    "headers":{"a":1},
    "excuteCommonPreFunction": false,//by default true
    "excuteCommonPostFunction": false,//by default true
    "preScriptType":"C",
    "preScriptFile":"./preScript.js",
    "postScriptType":"C",
    "postScriptFile":"./postScript.js",
    "preScriptFunction":"APIcommonPre",
    "postScriptFunction":"APIcommonPost",
  }]
}
/*

  apis: [{
      
    
    "preScriptType":"F",
    "preScriptFunction":"testPre",
    "preScriptFile":"./common-pre.js",
    "postScriptType":"F",
    "postScriptFunction":"testPre",
    "postScriptFile":"./common-pre.js",
  }]
*/

export default apiDef;