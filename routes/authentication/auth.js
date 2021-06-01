const express = require("express");
const { hash, unhash } = require("../../utils/hashed");
const {
  Auth,
  validateUserLogin,
  validateUserRegistration,
  validateAdminRegistration,
} = require("../../model/authentication/auth");
const nodemailer = require("nodemailer");
const isAuth = require("../../middleware/isAuth");
const isAdmin = require("../../middleware/isAdmin");
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const { AdminAccess } = require("../../model/permission/admin");
const { SuperAdminAccess } = require("../../model/permission/superAdmin");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "teamalfy@gmail.com",
    pass: "vluoweepmltsbnzs",
  },
});

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

router.post("/login", async (req, res) => {
  const { error } = validateUserLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await Auth.findOne({ email: req.body.email.trim() });
  if (!user) return res.status(400).send("Invalid email or password");

  if (user.role === "admin" || user.role === "super admin")
    return res.status(400).send("Invalid email or password");

  const password = await unhash(req.body.password.trim(), user.password);
  if (!password) return res.status(400).send("Invalid email or password");

  const token = user.generateToken();
  res.header("x-auth-token", token).send(token);
});

//MOBILE LOGIN
router.post("/mobile/login", async (req, res) => {
  const { error } = validateUserLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await Auth.findOne({ email: req.body.email.trim() });
  if (!user) return res.status(400).send("Invalid email or password");

  if (user.role === "admin" || user.role === "super admin")
    return res.status(400).send("Invalid email or password");

  const password = await unhash(req.body.password.trim(), user.password);
  if (!password) return res.status(400).send("Invalid email or password");

  // const token = user.generateToken();
  // res.header("x-auth-token", token).send(token);
  res.send(user);
});

router.post("/login-admin", async (req, res) => {
  const { error } = validateUserLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await Auth.findOne({ email: req.body.email.trim() });
  if (!user) return res.status(400).send("Invalid email or password");

  if (user.role === "end user")
    return res.status(400).send("Invalid email or password");

  const password = await unhash(req.body.password.trim(), user.password);
  if (!password) return res.status(400).send("Invalid email or password");

  const token = user.generateToken();
  res.header("x-auth-token", token).send(token);
});

router.post("/register", async (req, res) => {
  const { error } = validateUserRegistration(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // const access = await AdminAccess.findOne();
  // if (!access.addCustomer && req.userToken.role === "admin")
  //   return res.status(400).send("You dont have access to add customer");

  // const access2 = await SuperAdminAccess.findOne();
  // if (!access2.addCustomer && req.userToken.role === "super admin")
  //   return res.status(400).send("You dont have access to add customer");

  const user = await Auth.findOne({ email: req.body.email.trim() });
  if (user) return res.status(400).send("Email is already in use");

  const newUser = new Auth({
    role: "end user",
    email: req.body.email.trim(),
    username: req.body.username.trim(),
    password: await hash(req.body.password.trim()),
  });

  await newUser.save();
  const token = newUser.generateToken();
  res.header("x-auth-token", token).send(token);
});

//mobile user register
router.post("/mobile/register", async (req, res) => {
  const { error } = validateUserRegistration(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // const access = await AdminAccess.findOne();
  // if (!access.addCustomer && req.userToken.role === "admin")
  //   return res.status(400).send("You dont have access to add customer");

  // const access2 = await SuperAdminAccess.findOne();
  // if (!access2.addCustomer && req.userToken.role === "super admin")
  //   return res.status(400).send("You dont have access to add customer");

  const user = await Auth.findOne({ email: req.body.email.trim() });
  if (user) return res.status(400).send("Email already in use");

  const newUser = new Auth({
    role: "end user",
    email: req.body.email.trim(),
    username: req.body.username.trim(),
    password: await hash(req.body.password.trim()),
  });

  await newUser.save();
  // const token = newUser.generateToken();
  // res.header("x-auth-token", token).send(token);
  res.send(newUser);
});

router.post("/register-admin", isAuth, async (req, res) => {
  const { error } = validateAdminRegistration(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const access = await AdminAccess.findOne();
  if (!access.addAdmin && req.userToken.role === "admin")
    return res.status(400).send("You dont have access to add admin");

  const access2 = await SuperAdminAccess.findOne();
  if (!access2.addAdmin && req.userToken.role === "super admin")
    return res.status(400).send("You dont have access to add admin");

  const user = await Auth.findOne({ email: req.body.email.trim() });
  if (user) return res.status(400).send("Email already in use");

  const newUser = new Auth({
    role: req.body.role,
    email: req.body.email.trim(),
    username: req.body.username.trim(),
    password: await hash(req.body.password.trim()),
  });

  await newUser.save();
  // const token = newUser.generateToken();
  // res.header("x-auth-token", token).send(token);
  res.send(newUser);
});

router.get("/", async (req, res) => {
  const users = await Auth.find();
  if (!users) return res.status(404).send("No user found");

  res.send(users);
});

router.get("/user/:id", async (req, res) => {
  const user = await Auth.findOne({ email: req.params.id });
  if (!user) return res.status(404).send("No user found");

  res.send(user);
});

router.get("/one-user/:id", async (req, res) => {
  const user = await Auth.findById(req.params.id).select(
    "-profileURL -role -__v -registrationDate -password"
  );
  if (!user) return res.status(404).send("No user found");

  res.send(user);
});

router.get("/end-users", async (req, res) => {
  const endUsers = await Auth.find({ role: "end user" });
  if (!endUsers) return res.status(404).send("No end user found");

  res.send(endUsers);
});

router.get("/admins", async (req, res) => {
  const admins = await Auth.find({ role: { $ne: "end user" } });
  if (!admins) return res.status(404).send("No admins found");

  res.send(admins);
});

//isAdmin

router.put("/update/:id", [isAuth], async (req, res) => {
  // const { error } = validateAdminRegistration(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  const access = await AdminAccess.findOne();
  if (!access.updateCustomer && req.userToken.role === "admin")
    return res.status(400).send("You dont have access to update user");

  const access2 = await SuperAdminAccess.findOne();
  if (!access2.updateCustomer && req.userToken.role === "super admin")
    return res.status(400).send("You dont have access to update user");

  const isUser = await Auth.findById(req.params.id);
  if (!isUser) return res.status(400).send("User not found");

  const updatedUser = await Auth.findByIdAndUpdate(req.params.id, {
    email: req.body.email,
    username: req.body.username,
  });
  res.send(updatedUser);
});

router.put("/admin-update/:id", [isAuth], async (req, res) => {
  // const { error } = validateAdminRegistration(req.body);
  // if (error) return res.status(404).send(error.details[0].message);

  const access = await AdminAccess.findOne();
  if (!access.updateAdmin && req.userToken.role === "admin")
    return res.status(400).send("You dont have access to update admin details");

  const access2 = await SuperAdminAccess.findOne();
  if (!access2.updateAdmin && req.userToken.role === "super admin")
    return res.status(400).send("You dont have access to update admin details");

  const isUser = await Auth.findById(req.params.id);
  if (!isUser) return res.status(400).send("User not found");

  const updatedUser = await Auth.findByIdAndUpdate(req.params.id, {
    email: req.body.email,
    role: req.body.role,
    username: req.body.username,
  });
  res.send(updatedUser);
});

router.post("/reset-password", isAuth, async (req, res) => {
  const user = await Auth.findOne({
    email: req.userToken.email,
  });
  if (!user) return res.status(404).send("invalid user");
  const isPassword = await unhash(req.body.oldPassword.trim(), user.password);
  if (!isPassword) return res.status(404).send("Invalid password");

  user.password = await hash(req.body.password.trim());
  await user.save();
  res.send("OK");
});

router.post("/forgot-password-mail", async (req, res) => {
  var mailOptions = {
    from: "teamalfy@gmail.com",
    to: req.body.email,
    subject: "Zulucast",
    html: `<section><p><h2 style="color: grey;">Kindly click on the button bellow to reset your password.</h2></p><br/><hr/><br/><button style="background-color: #A6226C; border: none; color: white; padding: 15px 24px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 8px;"><a href="https://zulucast.herokuapp.com/modify-password/${req.body.email}" style="color: white; text-decoration: none;" >Reset Password<a/><button><section/>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) console.log(error);
    else console.log("Email sent: " + req.body.email);
  });
  res.send("OK");
});

router.post("/modify-password", async (req, res) => {
  const user = await Auth.findOne({
    email: req.body.email.trim(),
  });
  if (!user) return res.status(404).send("invalid email provided");
  // const isPassword = await unhash(req.body.oldPassword.trim(), user.password);
  // if (!isPassword) return res.status(404).send("Invalid password");

  user.password = await hash(req.body.password.trim());
  await user.save();
  res.send("OK");
});

router.post("/update-username", isAuth, async (req, res) => {
  const user = await Auth.findOne({
    email: req.userToken.email,
  });
  if (!user) return res.status(404).send("invalid user");

  user.username = req.body.username.trim();
  await user.save();
  res.send(user);
});

router.post("/update-username-mobile", async (req, res) => {
  const user = await Auth.findOne({
    email: req.body.email,
  });
  if (!user) return res.status(404).send("invalid user");

  user.username = req.body.username.trim();
  await user.save();
  res.send(user);
});

//isAdmin
router.delete("/delete/:id", [isAuth], async (req, res) => {
  const access = await AdminAccess.findOne();
  if (!access.updateCustomer && req.userToken.role === "admin")
    return res.status(404).send("You dont have access to delete user");
  if (!access.updateAdmin && req.userToken.role === "admin")
    return res.status(404).send("You dont have access to delete admin user");

  const access2 = await SuperAdminAccess.findOne();
  if (!access2.updateCustomer && req.userToken.role === "super admin")
    return res.status(404).send("You dont have access to delete user");
  if (!access2.updateAdmin && req.userToken.role === "super admin")
    return res.status(404).send("You dont have access to delete admin user");

  const userToDelete = await Auth.findById(req.params.id);
  if (!userToDelete) return res.status(404).send("User not found");
  const deleteUser = await Auth.findByIdAndRemove(req.params.id);
  res.send(deleteUser);
});

router.post(
  "/upload",
  [uploader.single("file"), isAuth],
  async (req, res, next) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    let user = await Auth.findOne({ email: req.userToken.email });

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
      user.profileURL = publicUrl;
      await user.save();
      res
        .status(200)
        .send({ fileName: req.file.originalname, fileLocation: publicUrl });
    });

    // When there is no more data to be consumed from the stream
    blobWriter.end(req.file.buffer);
  }
);

router.post(
  "/upload-mobile",
  [uploader.single("file")],
  async (req, res, next) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    let user = await Auth.findOne({ email: req.body.email });

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
      user.profileURL = publicUrl;
      user.username = req.body.username;
      await user.save();
      res.status(200).send(user);
    });

    // When there is no more data to be consumed from the stream
    blobWriter.end(req.file.buffer);
  }
);

module.exports = router;
