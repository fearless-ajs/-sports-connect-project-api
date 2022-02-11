const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require("validator");

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'User ObjectId must be supplied'],
        immutable: true
    },
    content: {
        type: String,
        maxlength: [5000, 'Title should not be more than 5000 characters'],
    },
    media: {
        type: String,
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
});

postSchema.pre('save', function (next) {
    if (!this.isModified() || this.isNew) return next();

    this.updatedAt = Date.now() - 1000; //Put at 1s in the past
    next();
});

postSchema.pre(/^find/, function (next) { //This fires whenever any query command with find is encountered
    this.populate({
        path: 'user',
        field: '-__v _id name email' //These are the fields we don't want
    }); //We use populate to make it return the ref values
    next();
});

module.exports = mongoose.model('Post', postSchema);