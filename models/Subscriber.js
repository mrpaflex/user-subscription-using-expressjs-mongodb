const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        required: true,
        type: String
    },
    userName:{
        type: String,
        required: true
    },

    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    
    subscription:{
        type: Boolean,
        default: true
    },
    payment: [{
        month: String,
        year: String,
        status:{
            type: Boolean,
            default: false
        }
    }],

    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('subscriber', SubscriberSchema)