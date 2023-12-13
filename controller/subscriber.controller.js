
const Subcriber = require('../models/Subscriber')
const { validationResult } = require('express-validator');
const {getMonthName, scheduledJob} = require('../utils/cronjob')

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    subscribed : async (req, res) => {

      const d = new Date();
      const month = d.getMonth();
      const year = d.getFullYear();

        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          let arr = errors.array();
          return res.status(400).json({ msg: arr[0].msg });
        }
    
        const { firstName, lastName, userName } = req.body;  

        try {
          
          const subscriber = await Subcriber.findOne({
            userName: { $regex: new RegExp(userName, 'i') }
          })

          if (subscriber) {
           return res.status(400).json({msg: 'Subscriber already exist'})
          }

          const newSubscriber = new Subcriber({
            firstName,
            lastName,
            userName,
            userid: req.user.id,
            payment: [
              {
              year,
              month: await getMonthName(month + 1),
            }
            ]
          })

          await newSubscriber.save();
          await scheduledJob(newSubscriber.id);

          return res.json({
            info: 'Subscrber created successfully'
          })

        } catch (error) {
          console.log(error)
          res.status(400).json({msg: 'server error while creating user'})
        }
    }
}