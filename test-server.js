
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
  app.all('**', function (req, res) {
    res.status(200).send(`${req.method} -- ${req.url} -- ${JSON.stringify(req.body)} ${JSON.stringify(req.headers)}`)
  })
  
  app.listen(3001);
  console.log("lestening the port 3001")


