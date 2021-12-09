const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require("validator");

//System Schema
const agentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'User ObjectId must be supplied'],
        unique: [true, 'You are not allowed to have more than one business account'],
        immutable: true
    },
    agency: {
        type: String,
        unique: [true, 'The business name exists, please choose another name'],
        required: [true, 'Please supply your business Name'],
        trim: true,
        maxlength: [40, 'The business Name must not have than 40 characters'],
        minlength: [2, 'The business Name must have more than 2 characters']
    },
    slug: String,
    website: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'We need your business email'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid business email']
    },
    phone: {
        type: String,
        required: [true, 'We need your business phone number'],
        trim: true,
        validate: [validator.isMobilePhone, 'Please provide a valid phone number']
    },
    address: {
        type: String,
        required: [true, 'Please we need an address for this brand'],
        maxlength: [200, 'The address must have less or equal than 200 characters'],
        minlength: [4, 'The address page link must have more or equal than 4 characters']
    },
});

module.exports = mongoose.model('Agent', agentSchema);