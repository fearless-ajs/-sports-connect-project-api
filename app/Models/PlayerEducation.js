const mongoose = require('mongoose');

//System Schema
const playerEducationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'User ObjectId must be supplied']
    },
    School: {
        type: String,
        required: [true, 'School name must be supplied'],
        maxlength: [200, 'The school name must not have more than 200 characters'],
        minlength: [2, 'The school name must have more or equal than 2 characters']
    },
    degree: {
        type: String,
        required: [true, 'Obtained degree name must be supplied'],
        maxlength: [50, 'The Obtained degree must not have more than 50 characters'],
        minlength: [2, 'The Obtained degree must have more or equal than 2 characters']
    },
    fieldOfStudy: {
        type: String,
        required: [true, 'Field of study name must be supplied'],
        maxlength: [100, 'The school name must not have more than 100 characters'],
        minlength: [2, 'The school name must have more or equal than 2 characters']
    },
    startMonth: {
        type: String,
        required: [true, 'Start month must be supplied'],
        trim: true,
        maxlength: [20, 'The start month must not have more than 20 characters'],
        minlength: [2, 'The start month must have more or equal than 2 characters']
    },
    startYear: {
        required: [true, 'Start year must be supplied'],
        type: Number,
        trim: true,
    },
    endMonth: {
        required: [true, 'End month must be supplied'],
        type: String,
        trim: true,
        maxlength: [20, 'The end month must not have more than 20 characters'],
        minlength: [2, 'The end month must have more or equal than 2 characters']
    },
    endYear: {
        required: [true, 'End year must be supplied'],
        type: Number,
        trim: true,
    },
    grade: {
        type: Number,
        trim: true,
    },
    activitiesAndSocieties: {
        type: String,
        maxlength: [200, 'Activities and societies  must not have more than 200 characters'],
        minlength: [2, 'Activities and societies  must have more or equal than 2 characters']
    },
    Description: {
        type: String,
        maxlength: [500, 'Description must not have more than 500 characters'],
        minlength: [2, 'Description  must have more or equal than 2 characters']
    },
    media: String,
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

playerEducationSchema.pre('save', function (next) {
    if (!this.isModified() || this.isNew) return next();

    this.updatedAt = Date.now() - 1000; //Put at 1s in the past
    next();
});

playerEducationSchema.pre(/^find/, function (next) { //This fires whenever any query command with find is encountered
    this.populate({
        path: 'user',
        field: '-__v _id name email' //These are the fields we don't want
    }); //We use populate to make it return the ref values
    next();
});


module.exports = mongoose.model('PlayerEducation', playerEducationSchema);