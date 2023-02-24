const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const asyncHandler = require('express-async-handler');

const auth = asyncHandler(async (req, res, next) => {

    try {

        const { authorization } = req.headers

        if (!authorization) {
            throw new Error('Invalid authorization');
        }

        const token = authorization.replace('Bearer ', '');

        const decode = await jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decode._id);

        if (!user) {
            throw new Error();
        }

        req.user = user

    } catch (err) {
        res.status(401)
        throw new Error('Invalid authorization')
    }
    next();
})



module.exports = auth