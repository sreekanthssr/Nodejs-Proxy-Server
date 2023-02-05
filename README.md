# Nodejs-Proxy-Server
**Create a proxy server from JavaScript/ JSON. The module will support POST/GET/PUT/DELETE API methods. We can create a
token on the fly and use the existing token. An additional enhancement is possible by using pre/post script for all the
APIs and/or specific.**

Please check the example folder for implementation.

Example API config Javascript<br />
<pre>
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
export default apiDef
</pre>


Example API config JSON<br />
<pre>
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
</pre>
Config<br />
<p><b>version</b> </b>: [Required] [String] The provide a valid version no eg: "1.0.0"</p>
<p><b>baseURL</b>: [Required] [String] The baseURL should be the pointing backend server eg: "http://anymicroservice:3001".
</p>
<p><b>preCommonFunction</b>: [optional] [String] Give function needs to execute before all the microservice API. While
  configuring this need to provide the 'preCommonScriptFile'.
  The function will call with option as the first argument and request as the second argument. The function should
  return updated options.
  eg: export default function preScript(option, request) { return option};
</p>
<p><b>preCommonScriptFile </b>: [optional] [String] Use this config to specify the javascript file name that has
  'preCommonFunction'. eg: "./preScript.js". And also any of the API config have this config "preScriptType":"C" need to
  specify the file path here.
</p>
<p><b>postCommonFunction</b>: [optional] [String] The function will to execute after all the microservice API. While
  configuring this option need to provide the 'postCommonScriptFile'. The function will call with the request as first,
  response as the second argument, and microservice response as third argument. The function should return the updated
  microserviceAPIResponse back.
  eg: export default function postScript(request, response, microserviceAPIResponse) { return
  updatedMicroserviceAPIResponse};
</p>
<p><b>postCommonScriptFile </b>: [optional] [String] Use this config to specify the javascript file name that has
  'postCommonFunction'. eg: "./postScript.js". And also any of the API configs have this config "postScriptType":"C"
  need to specify the file path here.
</p>
<p><b>createTokenConfig</b>: [optional] [JSON] If API needs to create the token during a microservice API call need to provide
  the configuration (eg: apis[0].accessTokenSetting is 'C').</p>
    <p><b>url</b>: [Required] [String] Provide the token creation URL eg: https://www.auth.com/auth</p>
    <p><b>headers</b>: [Required] [JSON] Provide the header details in JSON. </p>
    <p><b>methode</b>: [Optional] [String] Provide the method 'GET' or 'POST'. By default post.</p>
    <p><b>tokenKey </b>: [Required] [String] The mapping key for getting the token from API call.</p>
    <p><b>tokenName [Required] [String] Provide the token name to send the token in microservice API.</p>
    <p><b>data</b>: [Optional] [JSON] Aditional data like Client ID and Secret should be in JSON format.</p>
    <p><b>tokenPrefix</b>: [Optional] [String] This config can use to provide a prefix to the token. </p></pre>
<p><b>apis </b>: [Required] [ArrayOfObject] Please define all the proxy config as an object.</p>
<p><b>type</b>: [Required] [String] Use any of the following methods that want to define for API endpoint
  'post'|'get'|'put'|'delete' eg: get</p>
<p><b>path</b>: [Required] [String] Specify the API path proxy endpoint eg: /getDetails</p>
<p><b>microserviceURL</b>: [Required] [String] Specify the microservice endpoint need to call from the proxy server eg:
  /getProductDetails</p>
<p><b>microserviceType</b>: [Required] [String] Use any of the following methods for microservice 'post'|'get'|'put'|'delete'
  eg: post</p>
<p><b>responseType </b>: [optional] [String] Use any of the following types and mention the response type 'arraybuffer'|
  'document'|'json'|'text'| 'stream'</p>
<p><b>appendBasePath</b>: [optional] [Boolen] Use the config to avoid the baseURL appending to the microserviceURL. By default,
  it will be true. By confiuring 'flase', 'microserviceURL' can give full path microservice and call any microservice
  API, not under 'baseURL' domain</p>
<p><b>accessTokenSetting </b>: [optional] [String] There are two options available for this config 'C' and 'E'. By using 'C'
  token will create it at the time of API call and need to provide the 'createTokenConfig' pleas ref: example. 'E' will
  take the token from the header of the request. need to specify the 'tokenMapping' in JSON format</p>
<p><b>dataMapping</b>: [optional] [JSON] Please use the config to map the post data. The JSON key will input the data 'key' and
  the 'value' will be the microservice key eg:
  {
  "name": "username",//Proxy API will get the 'name' and map it to 'username' and send it to microservice
  "email": "emailId"
  }</p>
<p><b>queryParam</b>: [optional] [JSON] Please use the config to map the query param. The JSON key will input the data 'key' and
  the 'value' will be the microservice key eg:
  {
  "name": "username",//Proxy API will get the 'name' and map it to 'username' and send it to microservice
  "email": "emailId"
  }</p>
<p><b>headers</b>: [optional] [JSON] Can pass additional headers in the microservice API</p>
<p><b>executeCommonPreFunction</b>: [optional] [Boolen] Use this config to avoid the common pre-function execution. By default
  true and it will execute the common pre-function</p>
<p><b>executeCommonPostFunction</b>: [optional] [Boolen] Use this config to avoid the common post function execution. By
  default true and it will execute the common post function</p>
<p><b>preScriptType</b>: [optional] [String] This configuration will help to define the type of per script available options
  are 'C' and 'F'. 'C' option will help to run the function in the common script and need to specify the
  'preCommonScriptFile'. 'F' option will execute a specific file with the default exported function need to provide the
  'preScriptFile'.</p>
<p><b>postScriptType</b>: [optional] [String] This configuration will help to define the type of per script available options
  are 'C' and 'F'. 'C' option will help to run the function in the common script and need to specify the
  'postCommonScriptFile'. 'F' option will execute a spcific file with the default exported function needs to provide the
  'postScriptFile'</p>
<p><b>preScriptFile</b>: [optional] [String] Use this config with 'preScriptType' as 'F'. Please provide a javascript file name
  (eg: ./apiPreScript.js). Required a default exported function. The function will call with option as the first
  argument and request as the second argument. The function should return updated options. This will execute before the
  microservice API call
  eg: export default function preScript(option, request) { return option};</p>
<p><b>postScriptFile</b>: [optional] [String] Use this config with 'postScriptType' is 'F'. Please provide a javascript file
  name (eg: ./apiPostScript.js). Required a default exported function the function will call with the request as first,
  response as the second argument, and microservice response as third argument. The function should return the updated
  microserviceAPIResponse. This will execute after the microservice API call
  eg: export default function postScript(request, response, microserviceAPIResponse) { return
  updatedMicroserviceAPIResponse};</p>
<p><b>preScriptFunction</b>: [optional] [String] Use this config with 'postScriptType' as 'C'. Need to specify the function
  name in the javascript file. The function will call with option as the first argument and request as the second
  argument. The function should return updated options. This will execute before the microservice API call
  eg: export default function preScript(option, request) { return option};</p>
<p><b>postScriptFunction</b>: [optional] [String] Use this config with 'postScriptType' is 'C'. Need to specify the function
  name in the javascript file. The function will call the request as first, the response as the second argument, and the
  microservice response as the third argument. The function should return the updated microserviceAPIResponse. This will
  execute after the microservice API call
  eg: export default function postScript(request, response, microserviceAPIResponse) { return
  updatedMicroserviceAPIResponse};</p>
<p><b>"tokenPrefix"</b>: [optional] [String] this config can use to give a Prefix before sending the token to the microservice
  API.</p>