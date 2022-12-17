import dotenv from 'dotenv'
dotenv.config();
import getAPIConfig from './common/get-api-config.js';
import valiateAPIConfig from'./common/api-validator.js';
import express from 'express';
const app = express();
const apiConfig = getAPIConfig();
if(valiateAPIConfig(apiConfig)){
  app.all('**', function (req, res) {
    res.send('hello world');
  })
  
  app.listen(3001);
}

