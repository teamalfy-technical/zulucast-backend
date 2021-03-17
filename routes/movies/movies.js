const express = require("express");
const multer = require("multer");
const isAuth = require("../../middleware/isAuth");
const isAdmin = require("../../middleware/isAdmin");
const { Storage } = require("@google-cloud/storage");
const { Movies, validateMovie } = require("../../model/movies/movies");

const router = express.Router();

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
  },
});

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS,
});

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL);

router.post("/", [isAuth, isAdmin], async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movies.findOne({ title: req.body.title });
  if (movie) return res.status(400).send("Movie with this title already exist");

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
  const movie = await Movies.findById(req.params.id);
  if (!movie) return res.status(404).send("No movie found");

  res.send(movie);
});

router.put("/update/:id", [isAuth, isAdmin], async (req, res) => {
  const movie = await Movies.findById(req.params.id);
  if (!movie) return res.status(404).send("No movie found");

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

router.delete("/delete/:id", [isAuth, isAdmin], async (req, res) => {
  const movie = await Movies.findById(req.params.id);
  if (!movie) return res.status(404).send("No movie found");

  const movieToDelete = await Movies.findByIdAndDelete(req.params.id);
  res.send(movieToDelete);
});

router.post(
  "/upload-movie-image",
  [uploader.single("file"), isAuth, isAdmin],
  async (req, res, next) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

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

module.exports = router;
