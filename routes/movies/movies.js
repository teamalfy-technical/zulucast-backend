const express = require("express");
const multer = require("multer");
const isAuth = require("../../middleware/isAuth");
const isAdmin = require("../../middleware/isAdmin");
const { Storage } = require("@google-cloud/storage");
const { Movies, validateMovie } = require("../../model/movies/movies");
const { AdminAccess } = require("../../model/permission/admin");
const { SuperAdminAccess } = require("../../model/permission/superAdmin");
const AWS = require("aws-sdk");
const config = require("config");
const { v4: uuid } = require("uuid");

const router = express.Router();

//set up an s3
const s3 = new AWS.S3({
  accessKeyId: config.get("ID"),
  secretAccessKey: config.get("secret"),
  httpOptions: { timeout: 10 * 60 * 1000 },
});

//set up multer
const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50000 * 1024 * 1024, // keep images size < 5 MB
  },
});

var options = { partSize: 5 * 1024 * 1024, queueSize: 10 };

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS,
});

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL);

//[isAuth, isAdmin]
router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movies.findOne({ title: req.body.title });
  if (movie) return res.status(400).send("Movie with this title already exist");

  // check if is banner from the body is true,
  // if it is then update the existing is banner to false,

  if (req.body.isBanner) {
    const obj = await Movies.findOne({ isBanner: true });
    if (obj) {
      obj.isBanner = false;
      await obj.save();
    }
  }

  const newMovie = new Movies({
    title: req.body.title,
    genre: req.body.genre,
    price: req.body.price,
    isBanner: req.body.isBanner,
    description: req.body.description,
    actor: req.body.actor,
    duration: req.body.duration,
    releaseYear: req.body.releaseYear,
    releaseType: req.body.releaseType,
    moviePictureURL: req.body.moviePictureURL,
    movieTrailerURL: req.body.movieTrailerURL,
    movieVideoURL: req.body.movieVideoURL,
  });

  await newMovie.save();
  res.send(newMovie);
});

router.get("/", async (req, res) => {
  const movies = await Movies.find();
  if (!movies) return res.status(404).send("No movie found");

  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await Movies.findById(req.params.id).select(
    "-uploadDate -__v -moviePictureURL -movieTrailerURL -movieVideoURL"
  );
  if (!movie) return res.status(404).send("No movie found");

  res.send(movie);
});

//isAdmin
router.put("/update/:id", [isAuth], async (req, res) => {
  const movie = await Movies.findById(req.params.id);
  if (!movie) return res.status(404).send("No movie found");

  const access = await AdminAccess.findOne();
  if (!access.updateMovie && req.userToken.role === "admin")
    return res.status(400).send("You dont have access to update movie");

  const access2 = await SuperAdminAccess.findOne();
  if (!access2.updateMovie && req.userToken.role === "super admin")
    return res.status(400).send("You dont have access to update movie");

  const updateMovie = await Movies.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    genre: req.body.genre,
    price: req.body.price,
    isBanner: req.body.isBanner,
    description: req.body.description,
    actor: req.body.actor,
    duration: req.body.duration,
    releaseYear: req.body.releaseYear,
    releaseType: req.body.releaseType,
    moviePictureURL: req.body.moviePictureURL,
    movieTrailerURL: req.body.movieTrailerURL,
    movieVideoURL: req.body.movieVideoURL,
  });
  res.send(updateMovie);
});

// router.post("/u", async (req, res) => {
//   const m = await Movies.findOne();
//   m.movieVideoURL = "";
//   await m.save();
//   res.send(m);
// });

//, isAdmin
router.delete("/delete/:id", [isAuth], async (req, res) => {
  const access = await AdminAccess.findOne();
  if (!access.updateMovie && req.userToken.role === "admin")
    return res.status(400).send("You dont have access to delete movie");

  const access2 = await SuperAdminAccess.findOne();
  if (!access2.updateMovie && req.userToken.role === "super admin")
    return res.status(400).send("You dont have access to delete movie");

  const movie = await Movies.findById(req.params.id);
  if (!movie) return res.status(400).send("No movie found");

  const movieToDelete = await Movies.findByIdAndDelete(req.params.id);
  res.send(movieToDelete);
});

//isAuth, isAdmin
router.post(
  "/upload-movie-image",
  [uploader.single("file"), isAuth],
  async (req, res, next) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const access = await AdminAccess.findOne();
    if (!access.addMovie && req.userToken.role === "admin")
      return res.status(400).send("You dont have access to add movie");

    const access2 = await SuperAdminAccess.findOne();
    if (!access2.addMovie && req.userToken.role === "super admin")
      return res.status(400).send("You dont have access to add movie");

    // Create new blob in the bucket referencing the file
    const blob = bucket.file(req.file.originalname);

    // Create writable stream and specifying file mimetype
    const blobWriter = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    blobWriter.on("error", (err) => next(err));

    blobWriter.on("finish", async () => {
      // Assembling public URL for accessing the file via HTTP
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURI(blob.name)}?alt=media`;

      // Return the file name and its public URL
      res
        .status(200)
        .send({ fileName: req.file.originalname, fileLocation: publicUrl });
    });
    // When there is no more data to be consumed from the stream
    blobWriter.end(req.file.buffer);
  }
);

router.post("/upload-video", [uploader.single("video")], async (req, res) => {
  let myFile = req.file.originalname.split(".");
  const fileType = myFile[myFile.length - 1];

  //var readStream = fs.createReadStream(req.file.originalname);

  const params = {
    Bucket: config.get("bucket_name"),
    Key: `${uuid()}.${fileType}`,
    Body: req.file.buffer,
  };

  s3.upload(params, options, (err, data) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(data);
  }).on("httpUploadProgress", (evt) => {
    console.log(
      "Completed " + ((evt.loaded * 100) / evt.total).toFixed() + "% of upload"
    );
  });
});

module.exports = router;
