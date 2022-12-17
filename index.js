var express = require('express')
var app = express()

app.all('**', function (req, res) {
  res.send('hello world')
})

app.listen(3000)