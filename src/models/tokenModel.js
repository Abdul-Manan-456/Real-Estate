const mongoose = require('mongoose');



const tokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    token: {
        type: String,
        required: true,
    },
    expireAt: {
        type: Date,
        default: Date.now,
        required: true,
        index: { expires: 86400000 },
    }
})

module.exports = mongoose.model('Token', tokenSchema)