import express from 'express';
import bodyParser from 'body-parser';
import startProxyServer from '../index.js';

  const app = express();
  app.use( bodyParser.json() );
  app.use(bodyParser.urlencoded({
    extended: true
  })); 

  startProxyServer({app, configFile: './example/api-def.js'})
  
  app.listen(3000);
  console.log("lestening the port 3000")


