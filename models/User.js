const mongoose = require('mongoose');

const USerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        required: true,
        type: String
    },

    admin:{
        default: false,
        type: Boolean
    },
    date:{
        default: Date.now,
        type: Date

    }

})

module.exports = mongoose.model('user', USerSchema)
