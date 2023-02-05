const send400 = (res) => 
  res.status(400).send('Bad Request!');

const send401 = (res) => 
  res.status(401).send('Unauthorized');

const send403 = (res) => 
  res.status(403).send('Forbidden');

const send404 = (res) => 
  res.status(404).send('API not found!');

const send500 = (res) => 
  res.status(500).send('Internal Server Error');


export default {
  send400,
  send401,
  send403,
  send404,
  send500
}
