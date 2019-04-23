const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const addRequestId = require('express-request-id')({setHeader: false});
const morgan = require('morgan');
const chalk = require('chalk')

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
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'build')));


// routing
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



// listen
app.listen(port, () => console.log(`Welcome to crystal-eyes!\nListening on port ${port}.....\n`));