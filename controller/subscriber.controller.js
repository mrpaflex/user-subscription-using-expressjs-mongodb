
const Subcriber = require('../models/Subscriber')
const { validationResult } = require('express-validator');
const {getMonthName, scheduledJob} = require('../utils/cronjob')

const dotenv = require('dotenv');
const Subscriber = require('../models/Subscriber');
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
    },

  getallSubscribers: async (req, res) => {
      const { filter } = req.body;
    
      try {
        let totalSubscriberCount, subscribers;
    
        if (!filter || filter.toUpperCase() === 'ALL') {
          totalSubscriberCount = await Subscriber.countDocuments();
          subscribers = await Subscriber.find(
            {},
            {
              firstName: 1,
              lastName: 1,
              userName: 1,
              subscription: 1,
              'payment.status': 1
            }
          );
        } else if (filter.toUpperCase() === 'PENDING') {
          totalSubscriberCount = await Subscriber.countDocuments();
          subscribers = await Subscriber.find(
            { 'payment.status': false },
            {
              firstName: 1,
              lastName: 1,
              userName: 1,
              subscription: 1,
              'payment.status': 1
            }
          );
        }
    
        let allUsers = [];
    
        const promises = subscribers.map(async (item) => {
          let count = 0;
          await Promise.all(
            item.payment.map(async (item2) => {
              if (!item2.status) {
                count++;
              }
            })
          );
          allUsers.push({
            _id: item.id,
            firstName: item.firstName,
            lastName: item.lastName,
            userName: item.userName,
            subscription: item.subscription,
            due: count * 2000
          });
        });
    
        await Promise.all(promises);
        res.json({
          totalSubscriberCount,
          users: allUsers
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'server error' });
      }
    },

    monthlyPayment: async (req, res)=>{
      try {
        const user = await Subscriber.findOne({_id: req.params.id},
          {
            payment: 1,
          _id: 0
          }
          )

          if (!user) {
            return res.status(400).json({mes: 'id does not exist'})
          }

          res.json(user)
      } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'server error' });
      }
    },

    subscriberwiththermonthlypayment: async (req, res)=>{
      try {
        const subscriber = await Subscriber.find({}, {
          _id:1,
          firstName:1,
          subscription:1,
          payment:1
        })
        res.json({subscriber: subscriber})
      } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'server error' });
      }
    },
    monthlyreceivedpayment: async (req, res)=>{
    try {
      const subscriber = await Subscriber.updateOne(
        {_id: req.params.id, 'payment._id': req.params.paymentid},
        {
          $set: {
            'payment.$.status': true
          }
        }
      )

      res.json({
        subscriber: `subcriber with id ${req.params.id} payment has been received`
      })
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: 'server error' });
    }
    }

}