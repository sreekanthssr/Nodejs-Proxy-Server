import axios from 'axios';
import logMessage from './log.js';
const handelAPI = async(req,res, apiConfig)=>{
    try{
        const apiConfigJSON = JSON.parse(apiConfig);
        const apiDef = getAPIDef(req,apiConfigJSON)
        if(apiDef){
            const requestURL = getRequestURL(apiDef,apiConfigJSON);
            const response = await axios({
                method: apiDef.microserviceType,
                url: requestURL,
                responseType: apiDef.microserviceResponseType
            });
            res.status(response.status).send(response.data);
            
        }
    } catch(e){
        logMessage(e);
        res.status(500).send('Something broke!');
    }
    res.status(500).send('Something broke!');
}

const getAPIDef = (req, apiDef) =>{
    try {
        return apiDef.apis.find( api => {
            return api.type.toLowerCase() === req.method.toLowerCase() && api.path === req.url;
        });
    } catch (e) {
        logMessage(e); 
        return null;
    }
    return null;
}
const getRequestURL = (apiDef,apiConfig) =>{
    let url = '';
    if(apiDef.hasOwnProperty('appendBasePath') && apiDef.appendBasePath === false){}
    else {
        url = apiConfig.baseURL;
    }
    return `${url}${apiDef.microserviceURL}`;
} 


export default handelAPI;