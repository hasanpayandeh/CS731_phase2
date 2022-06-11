const mongoose = require('mongoose');

const votesSchema = mongoose.Schema({
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
    vote: {
        type: Number,
        required: [true, 'Please add a number value']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Votes', votesSchema);