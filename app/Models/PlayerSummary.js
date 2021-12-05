const mongoose = require('mongoose');

//System Schema
const playerSummarySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'User ObjectId must be supplied']
    },
    additionName: {
        type: String,
        trim: true,
        maxlength: [200, 'Additional name should not be more than 200 characters'],
        minlength: [2, 'Additional name should not be less than 2 characters']
    },
    headline: {
        required: [true, 'Headline field is required'],
        type: String,
        trim: true,
        maxlength: [200, 'Headline should not be more than 200 characters'],
        minlength: [2, 'Headline should not be less than 2 characters']
    },
    currentPosition: {
        required: [true, 'Headline field is required'],
        type: String,
        trim: true,
        maxlength: [200, 'Headline should not be more than 200 characters'],
        minlength: [2, 'Headline should not be less than 2 characters']
    },
    sportType: {
        required: [true, 'Sport type field is required'],
        type: String,
        trim: true,
        maxlength: [50, 'Sport type should not be more than 50 characters'],
        minlength: [2, 'Sport type should not be less than 2 characters']
    },
    education: {
        type: String,
        required: [true, 'School name must be supplied'],
        maxlength: [200, 'The school name must not have more than 200 characters'],
        minlength: [2, 'The school name must have more or equal than 2 characters']
    },
    state: {
        type: String,
        maxlength: [20, 'The state must have less or equal than 20 characters'],
    },
    country: {
        type: String,
        required: [true, 'Please supply your country'],
        maxlength: [20, 'The country must have less or equal than 20 characters'],
    },


    createdAt: {
        type: Date,
        default: Date.now
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

playerSummarySchema.pre('save', function (next) {
    if (!this.isModified() || this.isNew) return next();

    this.updatedAt = Date.now() - 1000; //Put at 1s in the past
    next();
});

playerSummarySchema.pre(/^find/, function (next) { //This fires whenever any query command with find is encountered
    this.populate({
        path: 'user',
        field: '-__v _id name email' //These are the fields we don't want
    }); //We use populate to make it return the ref values
    next();
});


module.exports = mongoose.model('PlayerSummary', playerSummarySchema);