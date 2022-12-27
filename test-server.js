
import express from 'express';

const app = express();

  app.all('**', function (req, res) {
    res.status(200).send(`${req.method} -- ${req.url}`)
  })
  
  app.listen(3001);
  console.log("lestening the port 3001")


