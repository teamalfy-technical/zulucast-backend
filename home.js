var fs = require("fs");
var tus = require("tus-js-client");

// specify location of file you'd like to upload below
var path = __dirname + "/acrimony2.mp4";
var file = fs.createReadStream(path);
var size = fs.statSync(path).size;
var mediaId = "";

var options = {
  endpoint:
    "https://api.cloudflare.com/client/v4/accounts/e7e95bfc02adbac72ebcd01b0e78f228/stream",
  headers: {
    Authorization: "Bearer Fd7-d9CvTpyiiQVDGMhe5ZeWfv7qV-atapiEH_fi",
  },
  chunkSize: 50 * 1024 * 1024, // Required a minimum chunk size of 5MB, here we use 50MB.
  resume: true,
  metadata: {
    filename: "acrimony2.mp4",
    filetype: "video/mp4",
    defaulttimestamppct: 0.5,
  },
  uploadSize: size,
  onError: function (error) {
    throw error;
  },
  onProgress: function (bytesUploaded, bytesTotal) {
    var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
    console.log(bytesUploaded, bytesTotal, percentage + "%");
  },
  onSuccess: function () {
    console.log("Upload finished");
  },
  onAfterResponse: function (req, res) {
    return new Promise((resolve) => {
      var mediaIdHeader = res.getHeader("stream-media-id");
      if (mediaIdHeader) {
        mediaId = mediaIdHeader;
      }
      resolve();
    });
  },
};

var upload = new tus.Upload(file, options);
upload.start();

//"mongodb+srv://ibrahim:fatimalove@educloud.xxhcu.mongodb.net/zulu",
//"FLWSECK_TEST-da8982749940be340f6821198f98b581-X",
//"FLWSECK_TEST-da8982749940be340f6821198f98b581-X",

// GCLOUD_PROJECT_ID="hypedup-4e4f6"
// GCLOUD_APPLICATION_CREDENTIALS="./services/zulu.json"
// GCLOUD_STORAGE_BUCKET_URL="gs://hypedup-4e4f6.appspot.com"
