const mongoose = require('mongoose');

const feedbackStatusSchema = new mongoose.Schema({
    active: {
        type: Boolean,
        default: false // Initially set to false
    }
});

module.exports = mongoose.model('FeedbackStatus', feedbackStatusSchema);
