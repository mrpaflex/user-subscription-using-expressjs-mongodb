const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    signupuser: async (req, res) => {
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
          res.status(400).json({ msg: 'server error during sign up, kindly try again' });
        }
      },

      userlogin: async (req, res)=>{
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          let arr = errors.array();
          return res.status(400).json({ msg: arr[0].msg });
        }

        const {email, password} = req.body;

        try {
            const user = await User.findOne({ email: { $regex: new RegExp(email, 'i') } });
            if (!user) {
                return res.status(400).json({msg: "inalid credential provided"})
            }
            
         const isMatch =   await bcrypt.compare(password, user.password);

         if (!isMatch) {
            return res.status(400).json({msg: 'invalid password or credential provided'})
         }

         const payload={
            user: {
                id: user._id
            }
         }

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
            console.log(error)
            res.status(500).json({ msg: 'server error during login, please try again' });
        }

      }
}