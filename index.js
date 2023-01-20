import getAPIConfig from './common/get-api-config.js';
import valiateAPIConfig from'./common/api-validator.js';
import handelAPI from './common/handel-api.js';
import logMessage from './common/log.js';

async function startProxyServer({configFile, app}){
  const apiConfig = await getAPIConfig(configFile);
  if(valiateAPIConfig(apiConfig)){
    app.all('**', function (req, res) {
      handelAPI(req,res,apiConfig);
    })
  } else {
    logMessage("Please check the api configuration");
  }
}

export default startProxyServer;





