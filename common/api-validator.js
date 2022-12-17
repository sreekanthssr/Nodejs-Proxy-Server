const fs = import('fs');
const path = import('path');  
const log = import('./log'); 
export default function valiateAPIConfig(){
const apiConfigFileName = path.join(__dirname,process.env.API_CONFIG_FILE);
const apiConfig = fs.readFileSync(apiConfigFileName, 'utf8');
}

function basicValidator(apiConfig){
    try{
        const apiConfigJSON = JSON.parse(apiConfig);
        let message = "";
        let flag = true;
        if(apiConfigJSON){
            if(!apiConfigJSON.hasOwnProperty("version")){
                message = "Version is missing \n";
                flag = false;
            }
            if(!apiConfigJSON.hasOwnProperty("baseURL")){
                message = "Base URL is missing \n";
                flag = false;
            }
            if(!apiConfigJSON.hasOwnProperty("apis")){
                message = "APIs is missing \n";
                flag = false;
            } else if(!apiConfigJSON.apis.length) {
                message = "No API documents found \n";
                flag = false;
            }        
        }
    } catch (e){
        log.logMessage(`Basic validation failed ${e}`);
        return false;
    }
    return true;
}
