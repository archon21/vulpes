const router = require('express').Router();
var fs = require('fs');
var ytdl = require('ytdl-core');
var path = require('path');

router.post('/', async function(req, res, next) {
  var videoUrl = req.body.song;
  // var destDir = req.query.destDir;
  ytdl(videoUrl).pipe(fs.createWriteStream('video.mp4'));
  //   res.attachment('video.mp4');

  //   console.log(video)
  // ytdl.on('finish', function() {
  //   console.log('DONE');
  // });
    var info = await ytdl.getInfo(videoUrl);
    // var { title, thumbnail_url, formats } = info;
    // for (var i = 0; i < formats.length; i++) {
    //     var format = formats[i]
    //     console.log(format.type)
    //     if (format.type === 'audio/mp4') console.log(format)
    // }
    // const info2 = await ytdl.videoInfo(videoUrl);
    // console.log();
    console.log(info);
    // res.download(video)
});

module.exports = router;
