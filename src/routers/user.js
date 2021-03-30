const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

const router = new express.Router();

// for signing up, a user have to provide name, email and
// password of minimum 4 characters.
router.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
      console.log(e)
    res.status(400).send();
  }
});

// for logging in, a user have to provide email and password.
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
      console.log(e)
    res.status(400).send();
  }
});

// for accessing profile, a user should have an active jwt token
// in the request header as Authorization key and value should start
// as "Bearer "
router.get("/profile", auth, async (req, res) => {
  res.send(req.user);
});

// for logout and logoutAll, user must have the token in request header.
router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.token = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.send(500).send();
  }
});

module.exports = router;
