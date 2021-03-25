const express = require("express");
const { hash, unhash } = require("../../utils/hashed");
const {
  Auth,
  validateUserLogin,
  validateUserRegistration,
  validateAdminRegistration,
} = require("../../model/authentication/auth");
const isAuth = require("../../middleware/isAuth");
const isAdmin = require("../../middleware/isAdmin");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { error } = validateUserLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await Auth.findOne({ email: req.body.email.trim() });
  if (!user) return res.status(400).send("Invalid email or password");

  const password = await unhash(req.body.password.trim(), user.password);
  if (!password) return res.status(400).send("Invalid username or password");

  const token = user.generateToken();
  res.header("x-auth-token", token).send(token);
});

router.post("/register", async (req, res) => {
  const { error } = validateUserRegistration(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await Auth.findOne({ email: req.body.email.trim() });
  if (user) return res.status(400).send("Email already registered");

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

router.post("/register-admin", async (req, res) => {
  const { error } = validateAdminRegistration(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await Auth.findOne({ email: req.body.email.trim() });
  if (user) return res.status(400).send("Email already registered");

  const newUser = new Auth({
    role: req.body.role,
    email: req.body.email.trim(),
    username: req.body.username.trim(),
    password: await hash(req.body.password.trim()),
  });

  await newUser.save();
  const token = newUser.generateToken();
  res.header("x-auth-token", token).send(token);
});

router.get("/", async (req, res) => {
  const users = await Auth.find();
  if (!users) return res.status(404).send("No user found");

  res.send(users);
});

router.get("/user/:id", isAuth, async (req, res) => {
  const user = await Auth.findById(req.params.id);
  if (!user) return res.status(404).send("No user found");

  res.send(user);
});

router.get("/end-users", isAuth, async (req, res) => {
  const endUsers = await Auth.find({ role: "end user" });
  if (!endUsers) return res.status(404).send("No end user found");

  res.send(endUsers);
});

router.get("/admins", isAuth, async (req, res) => {
  const admins = await Auth.find({ role: { $ne: "end user" } });
  if (!admins) return res.status(404).send("No admins found");

  res.send(admins);
});

router.put("/update/:id", [isAuth, isAdmin], async (req, res) => {
  const { error } = validateAdminRegistration(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const isUser = await Auth.findById(req.params.id);
  if (!isUser) return res.status(404).send("User not found");

  const updatedUser = await Auth.findByIdAndUpdate(req.params.id, {
    role: req.body.role,
    email: req.body.email,
    username: req.body.username,
    password: await hash(req.body.password.trim()),
  });
  res.send(updatedUser);
});

router.post("/reset-password", async (req, res) => {
  const user = await Auth.findOne({
    email: req.body.email.trim(),
  });
  if (!user) return res.status(404).send("invalid user");
  const isPassword = await unhash(req.body.oldPassword.trim(), user.password);
  if (!isPassword) return res.status(404).send("Invalid password");

  user.password = await hash(req.body.password.trim());
  await user.save();
  res.send("OK");
});

router.delete("/delete/:id", [isAuth, isAdmin], async (req, res) => {
  const userToDelete = await Auth.findById(req.params.id);
  if (!userToDelete) return res.status(404).send("User not found");
  const deleteUser = await Auth.findByIdAndRemove(req.params.id);
  res.send(deleteUser);
});

module.exports = router;
