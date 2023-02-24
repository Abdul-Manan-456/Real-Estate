const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    bedrooms: {
        type: Number
    },
    washrooms: {
        type: Number
    },
    furnished: {
        type: Boolean
    },
    rateType: {
        type: String,
        enum: ['rent', 'sell'],
        // required: true
    },
    houseSize: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    location: {
        // GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    __v: {
        type: Number,
        select: false
    }
}, { timestamps: true }
)


module.exports = mongoose.model('Product', productSchema)