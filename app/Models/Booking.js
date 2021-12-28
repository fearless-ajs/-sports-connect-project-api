const mongoose = require('mongoose');

const waveSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'User ObjectId must be supplied'],
        immutable: true
    },
    receiver: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Receiver ObjectId must be supplied'],
        immutable: true
    },
    startDate: {
        type: String,
        required: [true, 'Start date must be supplied'],
        trim: true,
    },
    startTime: {
        type: String,
        required: [true, 'Start time must be supplied'],
        trim: true,
    },
    seen: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['Pending', 'Occurred', 'Terminated'],
        default: 'Pending'
    },
    receiverResponse: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Rescheduled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
});

waveSchema.pre(/^find/, function (next) { //This fires whenever any query command with find is encountered
    this.populate({
        path: 'user',
        field: '-__v _id name email' //These are the fields we don't want
    }); //We use populate to make it return the ref values
    next();
});

waveSchema.pre(/^find/, function (next) { //This fires whenever any query command with find is encountered
    this.populate({
        path: 'receiver',
        field: '-__v _id name email' //These are the fields we don't want
    }); //We use populate to make it return the ref values
    next();
});

module.exports = mongoose.model('Wave', waveSchema);