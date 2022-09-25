const mongoose = require('mongoose'); 
const Joi = require('joi'); 

const hashTagPlusSchema = new mongoose.Schema({
    text: {
        type: String, 
        required: true
    },
    expiry: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        defualt: 0
    },
    startedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    donateTo: {
        type: String,
        required: true
    }
}); 