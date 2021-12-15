const mongoose = require('mongoose');
const validator = require('validator');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name field is required'],
        trim: true,
        maxlength: [200, 'Name should not be more than 200 characters'],
        minlength: [2, 'Name should not be less than 2 characters']
    },
    email: {
        type: String,
        required: [true, 'Email field is required'],
        unique: true,
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
});

module.exports = mongoose.model('Contact', contactSchema);
