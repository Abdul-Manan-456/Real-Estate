const mongoose = require('mongoose');
const emailRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/
const validator = require('validator');
const bcrypt = require('bcrypt');
const Token = require('./../models/tokenModel')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        // required: true,
        lowercase: true,
        // minLength: [3, 'The First name must be at least 3 character long']
    },
    password: {
        type: String,
        // match: [emailRegex, 'Minimum eight characters, at least one letter, one special character and one number'],
        trim: true,
        // required: true
    },
    email: {
        type: String,
        trim: true,
        // required: true,
        // unique: [true, 'The email already exists'],
        // validate: [validator.isEmail, 'Invalid email']
    },
    cellNumber: {
        type: String,
        // required: true
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    profileImage: {
        type: String,
    },
    role: {
        type: String,
        enum: {
            // <<<<<<< HEAD
            values: ['seller', 'buyer'],
            // =======
            values: ['admin', 'seller', 'buyer'],
            // >>>>>>> 014696edb03247b7b343e5d583f52840c5274725
            message: '{VALUE} is not supported'
        },
        default: 'buyer'
    }
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },

    },

)

// VIRTUALS SCHEMA
userSchema.virtual('product', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'user',
    // options: { select: 'title' },
})

// HASHED PASSWORD
userSchema.pre('save', async function (next) {

    this.password = await bcrypt.hash(this.password, 10)
    next();
})

// RETURN THE SELECTED FIELDS
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.__v;
    delete obj.password;
    return obj;
};

// COMPARE PASSWORD
userSchema.methods.passwordCompare = async function (password) {
    return await bcrypt.compare(password, this.password)
}

//  CREATE TOKEN FOR FORGOT PASSWORD -- EMAIL VERIFICATION --
userSchema.methods.createToken = async function () {
    const token = new Token({ user: this._id, token: crypto.randomBytes(16).toString('hex') });
    await token.save();
    return token;
}

module.exports = mongoose.model('User', userSchema)







// <<<<<<< HEAD
// =======
module.exports = mongoose.model('User', userSchema)





// MyModel.virtual('referencedDocVirtual', {
//   ref: 'Referenced',
//   localField: 'referencedDoc',
//   foreignField: '_id',
//   justOne: true,
//   options: { select: 'field1 field2 -_id' }
// });



// >>>>>>> 014696edb03247b7b343e5d583f52840c5274725
