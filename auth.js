const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/User.js")

// Register
console.log("entered routes");

router.post('/register', 
  
  body('email').isEmail().withMessage('Enter valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be 6+ chars'),
  async (req, res) => {
    console.log("registration started in routes");
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;

      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: 'User already exists' });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({ email, password: hashedPassword });
      await user.save();

      const payload = { userId: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.ok.json({ msg:"Your Acount created"});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Login
router.post('/login', 
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
        console.log("login  started in routes");

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

      const payload = { userId: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);
    console.log("exsiting from  routes");

module.exports = router;
