const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const dotenv = require('dotenv');
dotenv.config();

router.post(
  '/',
  [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'provide a valid email address').isEmail(),
    check('password', 'password must be strong and from 6 or more characters').isLength({ min: 6 }),
  ],

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      let arr = errors.array();
      return res.status(400).json({ msg: arr[0].msg });
    }

    const { name, email, password } = req.body;

    try {
      const user = await User.findOne({ email: { $regex: new RegExp(email, 'i') } });

      if (user) {
        return res.status(400).json({ msg: 'user already exists' });
      }

      const createUser = new User({
        name,
        email: email.toLowerCase(),
        password: await bcrypt.hash(password, 10)
      });

      console.log(createUser);

      await createUser.save();

      const payload = {
        user: {
          id: createUser._id,
        },
      };

     jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.EXPIRE },

        (err, token) => {
          if (err) throw err;
          res.json({
            token,
          });
        }
      );
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: 'An error occurred during execution' });
    }
  }
);

module.exports = router;
