const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    signuptype: {
        type: String,
        required: [true, 'Please add a text value']
    },
    username: {
        type: String,
        required: [true, 'Please add a text value']
    },
    password: {
        type: String,
        required: [true, 'Please add a text value']
    },
    email: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Users', usersSchema);