const mongoose = require('mongoose');
const validator = require("validator");

//System Schema
const playerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'User ObjectId must be supplied'],
        immutable: true
    },
    favoriteWingName:{
        type: String,
        required: [true, 'Please supply your favorite wing name'],
        trim: true,
        maxlength: [40, 'The wing name must not have than 40 characters'],
        minlength: [2, 'The wing name must have more than 2 characters']
    },
    favoriteWingNo:{
        type: Number,
        required: [true, 'Please supply your favorite wing number'],
        trim: true,
        maxlength: [99, 'The wing number must not be above 99'],
    },
    phone: {
        type: String,
        required: [true, 'We need your buyer phone number'],
        trim: true,
        validate: [validator.isMobilePhone, 'Please provide a valid phone number']
    },
    facebookPageLink: {
        type: String,
        required: false,
        lowercase: true,
    },
    twitterPageLink: {
        type: String,
        required: false,
        lowercase: true,
    },
    instagramPageLink: {
        type: String,
        required: false,
        lowercase: true,
    },
    linkedInPageLink: {
        type: String,
        required: false,
        lowercase: true,
    },
    address: {
        type: String,
        required: [true, 'Please we need an address for this buyer'],
        maxlength: [200, 'The address must have less or equal than 200 characters'],
        minlength: [4, 'The address page link must have more or equal than 4 characters']
    },
    city: {
        type: String,
        required: [true, 'Please supply your city'],
        maxlength: [20, 'The city must have less or equal than 20 characters'],
    },
    state: {
        type: String,
        required: [true, 'Please supply your state'],
        maxlength: [20, 'The state must have less or equal than 20 characters'],
    },
    country: {
        type: String,
        required: [true, 'Please supply your country'],
        maxlength: [20, 'The country must have less or equal than 20 characters'],
    },
    postcode: {
        type: Number,
        required: [true, 'we need your postal code to process packages'],
        // validate: [validator.isPostalCode, 'Please provide a valid postal code near you']
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    //to make virtual properties show up on object and JSON
    //Virtual Properties are Fields that are not saved in the database but calculated using other values
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});


playerSchema.pre('save', function (next) {
    if (!this.isModified() || this.isNew) return next();

    this.updatedAt = Date.now() - 1000; //Put at 1s in the past
    next();
});

playerSchema.pre(/^find/, function (next) { //This fires whenever any query command with find is encountered
    this.populate({
        path: 'user',
        field: '-__v _id name email' //These are the fields we don't want
    }); //We use populate to make it return the ref values
    next();
});


module.exports = mongoose.model('Player', playerSchema);