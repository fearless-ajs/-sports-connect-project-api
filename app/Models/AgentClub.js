const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require("validator");

//System Schema
const agentClubSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ObjectId must be supplied'],
        unique: false,
        immutable: true
    },
    clubName: {
        type: String,
        required: [true, 'Please supply your club Name'],
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
        required: [true, 'Please we need an address for this brand'],
        maxlength: [200, 'The address must have less or equal than 200 characters'],
        minlength: [4, 'The address page link must have more or equal than 4 characters']
    },
    city: {
        type: String,
        required: [true, 'Please supply club city'],
        maxlength: [20, 'The club city must have less or equal than 20 characters'],
    },
    state: {
        type: String,
        required: [true, 'Please supply club state'],
        maxlength: [20, 'The club state must have less or equal than 20 characters'],
    },
    country: {
        type: String,
        required: [true, 'Please supply club country'],
        maxlength: [20, 'The club country must have less or equal than 20 characters'],
    },
    currentClub: {
        type: Boolean,
        default: false
    },
    startMonth: {
        type: String,
        required: [true, 'Start month must be supplied'],
        enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        trim: true,
        maxlength: [20, 'The start month must not have more than 20 characters'],
        minlength: [2, 'The start month must have more or equal than 2 characters']
    },
    startYear: {
        required: [true, 'Start year must be supplied'],
        type: Number,
        trim: true,
        min: 1900,
        max: new Date().getFullYear(),
    },
    endMonth: {
        type: String,
        trim: true,
        enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        maxlength: [20, 'The end month must not have more than 20 characters'],
        minlength: [2, 'The end month must have more or equal than 2 characters']
    },
    endYear: {
        type: Number,
        trim: true,
        min: 1900,
        max: new Date().getFullYear(),
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

agentClubSchema.pre('save', function (next) {
    if (!this.isModified() || this.isNew) return next();

    this.updatedAt = Date.now() - 1000; //Put at 1s in the past
    next();
});

agentClubSchema.pre(/^find/, function (next) { //This fires whenever any query command with find is encountered
    this.populate({
        path: 'user',
        field: '-__v _id name email' //These are the fields we don't want
    }); //We use populate to make it return the ref values
    next();
});

module.exports = mongoose.model('AgentClub', agentClubSchema);