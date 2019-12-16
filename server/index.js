const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const multer = require('multer');

const getHttpsOptions = async () => {
  return {
    key: fs.readFileSync(
      path.join(__dirname, 'security', 'server.key'),
      'utf8'
    ),
    cert: fs.readFileSync(
      path.join(__dirname, 'security', 'server.crt'),
      'utf8'
    )
  };
};

const PORT = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));
// var corsOptions = {
//   origin: 'https://localhost:' + PORT,
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
// app.use(cors(corsOptions));
app.options('*', cors());

var storage = multer.diskStorage({
  //multers disk storage settings
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    var datetimestamp = Date.now();
    cb(
      null,
      file.fieldname +
        '-' +
        datetimestamp +
        '.' +
        file.originalname.split('.')[file.originalname.split('.').length - 1]
    );
  }
});
var upload = multer({
  //multer settings
  storage: storage,
  fileFilter: function(req, file, callback) {
    //file filter
    // if (
    //   ['xls', 'xlsx'].indexOf(
    //     file.originalname.split('.')[file.originalname.split('.').length - 1]
    //   ) === -1
    // ) {
    //   return callback(new Error('Wrong extension type'));
    // }
    callback(null, true);
  }
}).single('file');
// app.use('/auth', require('./auth'))
app.use('/api', require('./api'));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});

app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  } else {
    next();
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

const createApp = async () => {
  try {
    const httpsOptions = await getHttpsOptions();
    var server = await https.createServer(httpsOptions, app);
    return server;
  } catch (err) {
    console.error(err);
  }
};

const run = async () => {
  const server = await createApp();
  server.listen(PORT, function() {
    console.log('Express server listening on PORT ' + server.address().port);
  });
};

run();
