import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import getAPIConfig from './common/get-api-config.js';
import valiateAPIConfig from'./common/api-validator.js';
import handelAPI from './common/handel-api.js';
dotenv.config();

const apiConfig = getAPIConfig();

if(valiateAPIConfig(apiConfig)){
  const app = express();
  app.use( bodyParser.json() );
  app.use(bodyParser.urlencoded({
    extended: true
  })); 
  app.all('**', function (req, res) {
    handelAPI(req,res,apiConfig);
  })
  /* app.post('/getuser', (req,res)=>{
    console.log(req.body);
    res.send('test')
  }) */
  
  app.listen(3000);
  console.log("lestening the port 3000")
}

