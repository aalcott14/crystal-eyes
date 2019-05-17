const express = require('express');
const addRequestId = require('express-request-id')({setHeader: false});
const morgan = require('morgan');
const chalk = require('chalk');
const multer = require('multer');
const PNGReader = require('png.js');
const predict = require ('./predict');

const app = express();
const port = 8080;

// logging middleware
app.use(addRequestId)
morgan.token('id', (req) => req.id.split('-')[0])
app.use(morgan(
  `| ${chalk.white(':date[web]')} | ${chalk.white('#:id')} | ${chalk.white('Started :method :url')}`,
  {immediate: true}))
app.use(morgan(`| ${chalk.green(':date[web]')} | ${chalk.green('#:id')} | ${chalk.green('Completed :status | :res[content-length] bytes in :response-time ms')}`))


// middlewares
// app.use(bodyParser.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const mult = multer();

// routing
app.post('/classify', mult.any(), function (req, res) {
  // const buffer = req.files[0].buffer;
  // const buffReader = new PNGReader(buffer);
  // buffReader.parse((err, png) => {
  //   const obj = {
  //     width: 299,
  //     height: 299,
  //     data: buffer
  //   }
    const theBuff = req.files[0].buffer;
    predict(req.files[0].buffer).then((results) => {
      res.send(theBuff);
    })
  // })
});



// listen
app.listen(port, () => console.log(`Welcome to crystal-eyes!\nListening on port ${port}.....\n`));