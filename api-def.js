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
    "tokenPrefix":"1234"
  },
  "preCommonFunction": "commonPre",
  "preCommonScriptFile": "./common-pre.js",
  "postCommonFunction": "commonPost",
  "postCommonScriptFile": "./common-pre.js",
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
    "excuteCommonPreFunction": true,//by default true
    "excuteCommonPostFunction": true,//by default true
    "preScriptType":"C",
    "preScriptFile":"./preScript.js",
    "postScriptType":"C",
    "postScriptFile":"./postScript.js",
    "preScriptFunction":"APIcommonPre",
    "postScriptFunction":"APIcommonPost",
    "tokenPrefix": "Bearer"
  }]
}


export default apiDef;