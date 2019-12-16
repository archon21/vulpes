const functions = require('firebase-functions');
var ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const cors = require('cors');
const fs = require('fs');
const admin = require('firebase-admin');
const path = require('path');
const uuid = require('uuid/v1');
var FFmpeg = require('fluent-ffmpeg');
const NodeID3 = require('node-id3');
const axios = require('axios');

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
adminConfig.credential = admin.credential.cert(
  require('../vulpes-26185-firebase-adminsdk-p07x5-d5f7b629c6.json')
);
(adminConfig.storageBucket = 'vulpes-26185.appspot.com'),
  (adminConfig.databaseURL = 'https://vulpes-26185.firebaseio.com');
admin.initializeApp(adminConfig);
console.log('STARTED');

const bucket = admin.storage().bucket();
const db = admin.firestore();

function getBase64(url) {
  return axios
    .get(url, {
      responseType: 'arraybuffer'
    })
    .then(response => Buffer.from(response.data, 'binary').toString('base64'));
}

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

const downloadSongFn = async (req, res) => {
  const { url, title, userId, artist, thumbnail } = req.body;

  // var destDir = req.query.destDir;

  console.log('IN', title, url, userId, artist);

  try {
    // ytdl.getInfo(url, (err, info) => {
    //   let formatToDownload;
    //   info.formats.some(format => {
    //     let fileType = format.mimeType.split(';');
    //     let fileTypeArr = fileType[0].split('/');
    //     if (fileTypeArr[0] === 'audio' && fileTypeArr[1] === 'mp4') {
    //       formatToDownload = format;

    //       return true;
    //     }
    //   });
    const fileRef = path.join(__dirname, `${title}.mp3`);
    const writeStream = fs.createWriteStream(fileRef);
    const ffmpeg = new FFmpeg()
      .input(ytdl(url))
      .format('mp3')
      .saveToFile(writeStream);

    ffmpeg.on('progress', e => console.log(e));
    ffmpeg.on('end', async () => {
      const tempImagePath = path.resolve(__dirname, 'temp.jpeg');
      const imageWriteStream = fs.createWriteStream(tempImagePath);
      const response = await axios.get(thumbnail, { responseType: 'stream' });
      response.data.pipe(imageWriteStream);
      // const imageType = headers['content-type'].split('/');
      // console.log(imageType[1], headers);
      imageWriteStream.on('finish', async () => {
        let tags = {
          title,
          artist,

          APIC: tempImagePath
        };
        NodeID3.removeTags(fileRef);
        NodeID3.write(tags, fileRef);
        const storageRef = await bucket.upload(fileRef, {
          destination: `users/${userId}/${title}`,
          contentType: 'audio/mpeg'
        });

        console.log(storageRef);

        const prefix = 'https://firebasestorage.googleapis.com/v0/';
        const postfix = '?alt=media&token=ee6b8cba-8fb1-40d0-a13b-13d3d64443b5';
        const gStorageRef = storageRef[0].metadata.selfLink;
        const location = `${prefix}${gStorageRef.slice(38)}${postfix}`;
        const id = uuid();
        const song = { location, title, artist };
        await db
          .collection('users')
          .doc(userId)
          .collection('library')
          .doc(id)
          .set(song);
        fs.unlink(fileRef, err => console.error(err));
        fs.unlink(tempImagePath, err => console.error(err));
        res.send({ id, song }).status(201);
      });
    });
  } catch (err) {
    console.error(err);
    res.send('ERROR').status(500);
  }

  // res.send('OK').status(200);
};

const querySongsFn = (req, res) => {
  try {
    const { query } = req.body;
    let filter;
    query &&
      ytsr.getFilters(query, (err, filters) => {
        if (err) throw err;
        filter = filters.get('Type').find(o => o.name === 'Video');
        ytsr.getFilters(filter.ref, (err, filters) => {
          if (err) throw err;
          filter = filters
            .get('Duration')
            .find(o => o.name.startsWith('Short'));
          var options = {
            limit: 5,
            nextpageRef: filter.ref
          };
          ytsr(null, options, (err, searchResults) => {
            res.send(searchResults).status(200);
            if (err) throw err;
            // dosth(searchResults);
          });
        });
      });
  } catch (err) {
    console.error(err);
    res.send('ERROR').status(500);
  }
};

exports.downloadSong = functions.https.onRequest((req, res) => {
  var corsFn = cors();
  corsFn(req, res, () => {
    downloadSongFn(req, res);
  });
});

exports.querySongs = functions.https.onRequest((req, res) => {
  var corsFn = cors();
  corsFn(req, res, () => {
    querySongsFn(req, res);
  });
});
