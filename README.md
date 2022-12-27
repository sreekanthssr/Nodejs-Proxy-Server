# Nodejs-Proxy-Server
Sample API config JSON
{
    "version": "1.0.0", // Version
    "baseURL": "http://localhost:3001/", // Microservice URL
    "preScriptFile":"", // Javascript file name
    "postScriptFile":"", // Javascript file name
    "preCommonFunction":"", // Javascript function name will excute before all the request
    "postCommonFunction":"", //Javascript function name will excute after all the request
    "createTokenConfig": {
        "url":"",
        "header":{},
        "methode":"",
        "data":"",
        "tokenName":"",
        "tokenSuffix":""
    },
    "apis": [{
            "type": "GET",//Required-Supported type GET, POST, PUT, DELETE
            "path": "getuser", //Required- String
            "microserviceURL": "getCustomer",//Required-string
            "appendBasePath": true, //Optional-Boolen
            "preScriptType":"",  //Optional-string  C - use common file , F - supporate file
            "preScriptFunction":"", // String function name Only consider if preScriptType = 'C'     
            "preScriptFile":"", //String javascript file path Only consider if preScriptType = 'F' 
            "postScriptType":"",//Optional-string  C - use common file , F - supporate file
            "postScriptFunction":"", // String function name Only consider if postScriptType = 'C'
            "postScriptFile":"", //String javascript file path Only consider if postScriptType = 'F' 
            "accessTokenSetting": "E", //Optional-string E- exisiting token C - create token from token configration
            "tokenMapping": {"token": "bearerToken"}, // Object Only consider if valid accessTokenSetting 
            "tokenSuffix":"", //Optional-string
            "mapping": [{
                "name": "username",
                "email": "emailId"
            }] // Optional Array of oject 
        }
    ]
}


{
    "version": "1.0.0",
    "baseURL": "http://localhost:3001/",
    "preScriptFile":"",
    "postScriptFile":"",
    "preCommonFunction":"",
    "postCommonFunction":"",
    "createTokenConfig": {
        "url":"",
        "header":{},
        "methode":"",
        "data":"",
        "tokenName":"",
        "tokenSuffix":""
    },
    "apis": [{
            "type": "GET",
            "path": "getuser",
            "microserviceURL": "getCustomer",
            "appendBasePath": true,
            "preScriptType":"",  
            "preScriptFunction":"",          
            "preScriptFile":"",
            "postScriptType":"",
            "postScriptFunction":"",
            "postScriptFile":"",
            "accessTokenSetting": "E",
            "tokenMapping": {"token": "bearerToken"},
            "tokenSuffix":"",
            "mapping": [{
                "name": "username",
                "email": "emailId"
            }]
        },
        {
            "type": "POST",
            "path": "postuser",
            "microserviceURL": "createCustomer",
            "accessTokenSetting": "E",
            "tokenMapping": {"token": "bearerToken"},
            "tokenSuffix":""
        },
        {
            "type": "PUT",
            "path": "putuser",
            "microserviceURL": "updateCustomer",
            "mapping": [{
                "name": "username",
                "email": "emailId"
            }],
            "accessTokenSetting": "C",
            "tokenMapping": {"token": "bearerToken"}
        }
    ]
}