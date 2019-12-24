// import cookieParser from 'cookie-parser';
var express = require('express');
var path = require('path');

const app = express();

app.use('/goepi/pizzeria/', express.static(path.join(__dirname, '../build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
