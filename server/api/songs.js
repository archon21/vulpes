const router = require('express').Router();
var fs = require('fs');
var ytdl = require('ytdl-core');
var path = require('path');
const ytsr = require('ytsr');
const firebase = require('firebase');
require('firebase/storage');
const { config } = require('../../secrets');
var multer = require('multer');

firebase.initializeApp(config);

const storage = firebase.storage();
// require('../../');

router.post('/', async function(req, res, next) {
  const { url, title, userId } = req.body;
  // var destDir = req.query.destDir;
  try {
    console.log('IN');
    const storageRef = storage.ref(`/users/${userId}/${title}.mp4`);
    const tempPath = path.join(__dirname, `${title}.mp4`);

    const readStream = ytdl(url, { filter: 'audioonly' });
    readStream.on('open', () => {
      console.log('Open');
    });

    readStream.on('data', chunk => {
      console.log(chunk);
      storageRef.put(chunk);
    });

    // ytdl(url, { filter: 'audioonly' }).pipe(fs.createWriteStream(storageRef.put()));
    // writeStream.on('close', () => {
    //   console.log('Closing');
    //   console.log(fs.readFile(tempPath), tempPath);
    //   // console.log('END', storageRef)
    //   storageRef.put(tempPath);
    //   // res.send('OK');
    // });
  } catch (err) {
    console.log(err);
  }
});

router.get(`/:query`, (req, res) => {
  const { query } = req.params;
  let filter;

  ytsr.getFilters(query, function(err, filters) {
    if (err) throw err;
    filter = filters.get('Type').find(o => o.name === 'Video');
    ytsr.getFilters(filter.ref, function(err, filters) {
      if (err) throw err;
      filter = filters.get('Duration').find(o => o.name.startsWith('Short'));
      var options = {
        limit: 5,
        nextpageRef: filter.ref
      };
      ytsr(null, options, function(err, searchResults) {
        res.send(searchResults);
        if (err) throw err;
        // dosth(searchResults);
      });
    });
  });
});

module.exports = router;
