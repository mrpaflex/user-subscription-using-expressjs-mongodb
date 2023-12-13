const express = require('express');
const router = express.Router();
const {check} = require('express-validator');

const subscribedController = require('../controller/subscriber.controller')
const UserAuth = require('../middleware/auth');

router.post('/user/subscribe', UserAuth.authuser,
[
    check('firstName', 'first name must not be empty').not().isEmpty(),
    check('lastName', 'last name must not be empty').not().isEmpty(),
    check('userName', 'user must not be empty').not().isEmpty(),
],
    subscribedController.subscribed
);

router.get('/user/getallsubscribers', UserAuth.authuser, subscribedController.getallSubscribers)

router.get('/payment/:id', UserAuth.authuser, subscribedController.monthlyPayment)

router.get('/sub/getallsubscriberwithmonthypay', subscribedController.subscriberwiththermonthlypayment)

router.put('/sub/monthlypayment/:id/:paymentid', subscribedController.monthlyreceivedpayment)

module.exports = router;