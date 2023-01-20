# Nodejs-Proxy-Server
Create a proxy server from API JavaScript/ JSON. The module will support POST/GET/PUT/DELETE API methods. We can create a token on the fly and use the existing token. An additional enhancement is possible by using pre/post script for all the APIs and/or specific.
Please check the example folder for implementation.
---------------------------------------------------------------------------------------------------
Example API config Javascript
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
    "executeCommonPreFunction": false,//by default true
    "executeCommonPostFunction": false,//by default true
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
---------------------------------------------------------------------------------------------------
Example API config JSON
{
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
    "executeCommonPreFunction": false,//by default true
    "executeCommonPostFunction": false,//by default true
    "preScriptType":"C",
    "preScriptFile":"./preScript.js",
    "postScriptType":"C",
    "postScriptFile":"./postScript.js",
    "preScriptFunction":"APIcommonPre",
    "postScriptFunction":"APIcommonPost",
    "tokenPrefix": "Bearer"
  }]
}
---------------------------------------------------------------------------------------------------
Config
    version : [Required] [String] The provide a valid version no eg: "1.0.0"

    baseURL: [Required] [String] The baseURL should be the pointing backend server eg: "http://anymicroservice:3001"

    preCommonFunction: [optional] [String] The function name needs to execute before all the microservice API. While configuring this one need to provide the 'preCommonScriptFile'.
    The function will call with option as the first argument and request as the second argument. The function should return updated options.
    eg: export default function preScript(option, request) { return option};

    preCommonScriptFile : [optional] [String] Use this config to specify the javascript file name that has 'preCommonFunction'. eg: "./preScript.js". And also any of the API config have this config "preScriptType":"C" need to specify the file path

    postCommonFunction: [optional] [String] The function name needs to execute after all the microservice API. While configuring this one need to provide the 'postCommonScriptFile'.
    The function should return the updated microserviceAPIResponse back. 
    eg: export default function postScript(request, response, microserviceAPIResponse) { return updatedMicroserviceAPIResponse};

    postCommonScriptFile : [optional] [String] Use this config to specify the javascript file name that has 'postCommonFunction'. eg: "./postScript.js". And also any of the API configs have this config "postScriptType":"C" need to specify the file path.

    createTokenConfig: [optional] [JSON] If API needs to create the token during a microservice API call need to provide the configuration (apis[0].accessTokenSetting is 'C').

        url: [Required] [String] Provide the token creation URL eg: https://www.auth.com/auth

        headers: [Required] [JSON] Provide the header details in JSON.

        methode: [Optional] [String] Provide the method 'GET' or 'POST'. By default post.

        tokenKey : [Required] [String] The mapping key for getting the token from API call.

        tokenName [Required] [String] Provide the token name to send the token in microservice API.

        data: [Optional] [JSON] Aditional data like Client ID and Secret should be in JSON format.

        tokenPrefix: [Optional] [String] This config can use to provide a prefix to the token. 


    apis : [Required] [ArrayOfObject] Please define all the proxy config as an object.

         type: [Required] [String] Use any of the following methods that want to define for API endpoint 'post'|'get'|'put'|'delete' eg: get

         path: [Required] [String] Specify the API path proxy endpoint eg: /getDetails

         microserviceURL: [Required] [String] Specify the microservice endpoint need to call from the proxy server eg: /getProductDetails

         microserviceType: [Required] [String] Use any of the following methods for microservice 'post'|'get'|'put'|'delete' eg: post

         responseType : [optional] [String] Use any of the following types and mention the response type 'arraybuffer'| 'document'|'json'|'text'| 'stream'

         appendBasePath: [optional] [Boolen] Use the config to avoid the baseURL appending to the microserviceURL. By default, it will be true. By confiuring 'flase', 'microserviceURL' can give full path microservice and call any microservice API, not under 'baseURL' domain

         accessTokenSetting : [optional] [String] There are two options available for this config 'C' and 'E'. By using 'C' token will create it at the time of API call and need to provide the 'createTokenConfig' pleas ref: example. 'E' will take the token from the header of the request. need to specify the 'tokenMapping' in JSON format

         dataMapping: [optional] [JSON] Please use the config to map the post data. The JSON key will input the data 'key' and the 'value' will be the microservice key eg: 
         {
            "name": "username",//Proxy API will get the 'name' and map it to 'username' and send it to microservice 
            "email": "emailId"
         }

         headers: [optional] [JSON] Can pass additional headers in the microservice API

         executeCommonPreFunction: [optional] [Boolen] Use this config to avoid the common pre-function execution. By default true and it will execute the common pre-function

         executeCommonPostFunction: [optional] [Boolen] Use this config to avoid the common post function execution. By default true and it will execute the common post function

         preScriptType: [optional] [String] This configuration will help to define the type of per script available options are 'C' and 'F'. 'C' option will help to run the function in the common script and need to specify the 'preCommonScriptFile'. 'F' option will execute a specific file with the default exported function need to provide the 'preScriptFile'.

         postScriptType: [optional] [String] This configuration will help to define the type of per script available options are 'C' and 'F'. 'C' option will help to run the function in the common script and need to specify the 'postCommonScriptFile'. 'F' option will execute a spcific file with the default exported function needs to provide the 'postScriptFile'

         preScriptFile: [optional] [String] Use this config with 'preScriptType' as 'F'. Please provide a javascript file name (eg: ./apiPreScript.js). Required a default exported function. The function will call with option as the first argument and request as the second argument. The function should return updated options. This will execute before the microservice API call
         eg: export default function preScript(option, request) { return option};

         postScriptFile: [optional] [String] Use this config with 'postScriptType' is 'F'. Please provide a javascript file name (eg: ./apiPostScript.js). Required a default exported function the function will call with the request as first, response as the second argument, and microservice response as third argument. The function should return the updated microserviceAPIResponse. This will execute after the microservice API call
         eg: export default function postScript(request, response, microserviceAPIResponse) { return updatedMicroserviceAPIResponse};

         preScriptFunction: [optional] [String] Use this config with 'postScriptType' as 'C'. Need to specify the function name in the javascript file. The function will call with option as the first argument and request as the second argument. The function should return updated options. This will execute before the microservice API call
         eg: export default function preScript(option, request) { return option};

         postScriptFunction: [optional] [String] Use this config with 'postScriptType' is 'C'. Need to specify the function name in the javascript file. The function will call the request as first, the response as the second argument, and the microservice response as the third argument. The function should return the updated microserviceAPIResponse. This will execute after the microservice API call
         eg: export default function postScript(request, response, microserviceAPIResponse) { return updatedMicroserviceAPIResponse};

         "tokenPrefix": [optional] [String] this config can use to give a Prefix before sending the token to the microservice API.


---------------------------------------------------------------------------------------------------