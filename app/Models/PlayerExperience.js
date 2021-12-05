const mongoose = require('mongoose');

//System Schema
const playerExperienceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'User ObjectId must be supplied']
    },
    title: {
        type: String,
        required: [true, 'Title must be supplied'],
        maxlength: [200, 'The Title must not have more than 200 characters'],
        minlength: [2, 'The Title must have more or equal than 2 characters']
    },
    employmentType: {
        type: String,
        required: [true, 'Type must be supplied'],
        maxlength: [50, 'Type must not have more than 50 characters'],
        minlength: [2, 'Type must have more or equal than 2 characters']
    },
    sportType: {
        required: [true, 'Sport type field is required'],
        type: String,
        trim: true,
        maxlength: [50, 'Sport type should not be more than 50 characters'],
        minlength: [2, 'Sport type should not be less than 2 characters']
    },
    clubName: {
        type: String,
        required: [true, 'Club name must be supplied'],
        maxlength: [100, 'The club name must not have more than 100 characters'],
        minlength: [2, 'The club name must have more or equal than 2 characters']
    },
    location: {
        type: String,
        required: [true, 'Location must be supplied'],
        maxlength: [100, 'The club location must not have more than 100 characters'],
        minlength: [2, 'The club location must have more or equal than 2 characters']
    },
    assignedWingName: {
        type: String,
        required: [true, 'Assigned wing must be supplied'],
        maxlength: [100, 'Assigned wing must not have more than 100 characters'],
        minlength: [2, 'Assigned wing must have more or equal than 2 characters']
    },
    assignedWingNo: {
        type: Number,
        required: [true, 'Please supply your favorite wing number'],
        trim: true,
        maxlength: [99, 'The wing number must not be above 99'],
    },
    currentRole: {
        type: Boolean,
        default: false
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
        type: String,
        trim: true,
        maxlength: [20, 'The end month must not have more than 20 characters'],
        minlength: [2, 'The end month must have more or equal than 2 characters']
    },
    endYear: {
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

playerExperienceSchema.pre('save', function (next) {
    if (!this.isModified() || this.isNew) return next();

    this.updatedAt = Date.now() - 1000; //Put at 1s in the past
    next();
});

playerExperienceSchema.pre(/^find/, function (next) { //This fires whenever any query command with find is encountered
    this.populate({
        path: 'user',
        field: '-__v _id name email' //These are the fields we don't want
    }); //We use populate to make it return the ref values
    next();
});


module.exports = mongoose.model('PlayerExperience', playerExperienceSchema);