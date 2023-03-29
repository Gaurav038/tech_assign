const express = require("express");
const router = express.Router()
const User = require('../models/User.js')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    console.log(user);
    await user.save();
  
    res.send('User created');
  });
  
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.status(400).send('Invalid email');
    }
  
    const validPassword = await bcrypt.compare(password, user.password);
  
    if (!validPassword) {
      return res.status(400).send('Invalid password');
    }
  
    const token = jwt.sign({ _id: user._id }, 'any_secret_code');
  
    res.status(200).json({"jwt_Token": token, "user_details": user})
  
  });

  module.exports = router;