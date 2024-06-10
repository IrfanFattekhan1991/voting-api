const auth = require("../middlewares/auth");
const User = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");

router.post("/signup", async (req, res) => {
  try {
    let user = await User.findOne({
      email: req.body.email,
      adhaarCard: req.body.adhaarCard,
    });

    if (user) return res.status(400).send("User already registered!");

    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(req.body.password, salt);

    user = new User({
      name: req.body.name,
      age: req.body.age,
      email: req.body.email,
      mobile: req.body.mobile,
      address: req.body.address,
      adhaarCard: req.body.adhaarCard,
      password: hashedPwd,
    });

    const token = user.generateAuthToken();
    //const token = jwt.sign({ _id: user._id }, process.env.JWT_PRIVATE_KEY);

    await user.save();
    res
      .header("x-auth-token", token)
      .status(201)
      .send(_.pick(user, ["_id", "name"]));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/login", async (req, res) => {
  let user = await User.findOne({ adhaarCard: req.body.adhaarCard });
  if (!user) return res.status(400).send("Invalid adhaar or password!");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Invalid adhaar or password!");

  const token = user.generateAuthToken();
  //const token = jwt.sign({ _id: user._id }, process.env.JWT_PRIVATE_KEY);
  res.send(token);
});

router.get("/profile", auth, async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  res.status(200).send(user);
});

router.put("/profile/password", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const { currentPassword, newPassword } = req.body;

    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword)
      return res.status(400).send("Password did not match!");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.status(200).send("Password updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
