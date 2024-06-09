const User = require("../models/user");
const express = require("express");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      age: req.body.age,
      email: req.body.email,
      mobile: req.body.mobile,
      address: req.body.address,
      adhaarCard: req.body.adhaarCard,
      password: req.body.password,
    });

    console.log(user);
    await user.save();
    res.send(user);
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Something went wrong!", err);
  }
});

module.exports = router;
