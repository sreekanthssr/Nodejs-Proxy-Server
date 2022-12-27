import dotenv from 'dotenv';
import express from 'express';
import getAPIConfig from './common/get-api-config.js';
import valiateAPIConfig from'./common/api-validator.js';
import handelAPI from './common/handel-api.js';
dotenv.config();
const app = express();
const apiConfig = getAPIConfig();

if(valiateAPIConfig(apiConfig)){
  app.all('**', function (req, res) {
    handelAPI(req,res,apiConfig);
/*     console.log(req);
    res.json(req); */
  })
  
  app.listen(3000);
  console.log("lestening the port 3000")
}

