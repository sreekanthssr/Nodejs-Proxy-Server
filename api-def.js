const apiDef = {
  "version": "1.0.0",
  "baseURL": "http://localhost:3001",
  "createTokenConfig": {
    "url":"http://localhost:3001/auth",
    "headers":{"sdf":"sdf"},
    "methode":"post",
    "data":"test",
    "tokenKey":"test",
    "tokenName":"sdf",
    "tokenSuffix":""
  },
  "preScriptFile": "./common-pre.js",
  "postScriptFile": "./common-pre.js",
  "preCommonFunction":"",//Validation needed
  "postCommonFunction":"",//Validation needed
  apis: [{
    "type": "get",
    "path": "/user",
    "microserviceURL": "/getCustomer",
    "microserviceType" : "POST",
    "responseType" : "jssdfdson",//Validation needed
    "microserviceResponseType" : "text",//Validation needed
    "appendBasePath": true,
    "accessTokenSetting": "C",    
    "tokenMapping": {"frontEndKey":"token", "MSKey":"bearerToken"},
    "preScriptType":"F",
    "preScriptFunction":"testPre",
    "preScriptFile":"./common-pre.js",
    "postScriptType":"F",
    "postScriptFunction":"testPre",
    "postScriptFile":"./common-pre.js",
    "dataMapping": {
      "name": "username",
      "email": "emailId"
    },//need to validate
    "headers":""//need to validate
  }]
  /* "preScriptFile":"",
  "postScriptFile":"",
  ,
  */

}

export default apiDef;