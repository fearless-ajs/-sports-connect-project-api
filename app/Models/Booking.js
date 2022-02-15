const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
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
    status: {
      type: String,
      default: 'Pending',
      enum: {
          values: ['Pending', 'Accepted', 'Rejected'],
          message: 'Status can only be either Pending, Accepted, or Rejected'
      }
    },
    seen: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
});

bookingSchema.pre(/^find/, function (next) { //This fires whenever any query command with find is encountered
    this.populate({
        path: 'user',
        field: '-__v _id name email' //These are the fields we don't want
    }); //We use populate to make it return the ref values
    next();
});

bookingSchema.pre(/^find/, function (next) { //This fires whenever any query command with find is encountered
    this.populate({
        path: 'receiver',
        field: '-__v _id name email' //These are the fields we don't want
    }); //We use populate to make it return the ref values
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);