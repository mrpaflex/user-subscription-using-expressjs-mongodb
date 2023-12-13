const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controller/user.controller');

router.post('/user/signup',
  [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'provide a valid email address').isEmail(),
    check('password', 'password must be strong and from 6 or more characters').isLength({ min: 6 }),
  ],

  userController.signupuser
 
);

router.post('/user/login',
    [
    check('email', 'please provide a valide email').isEmail(),
    check('password', 'provide correct password').exists(),
  ],
  userController.userlogin
)

module.exports = router;
