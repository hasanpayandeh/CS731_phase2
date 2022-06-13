const mongoose = require('mongoose');

const commentsSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Foods'
    },
    msg: {
        type: String,
        required: [true, 'Please add a text value']
    },
    answer: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Comments', commentsSchema);