const mongoose = require('mongoose');

const foodsSchema = mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    title: {
        type: String,
        required: [true, 'Please add a text value']
    },
    desc: {
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

module.exports = mongoose.model('Foods', foodsSchema);