const express = require('express');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const User = require('./../models/userModel')
const Token = require('./../models/tokenModel');
const sendEmail = require('../utils/email')
const path = require('path')

// CREATE USER ACCOUNT
exports.createUser = asyncHandler(async (req, res) => {

    try {
        const { email, password } = req.body

        const isUserFound = await User.findOne({ email })
        if (isUserFound) {
            res.status(409);
            throw new Error('This email address is already associated with another account.')
        }

        const user = await new User(req.body).save();

        // Generate the token for Email Validation
        const token = await user.createToken();

        // Send the token with email
        const link = `${process.env.BASE_URL}/user/verifyEmail/${user._id}/${token.token}`

        await sendEmail(user.email, link)

        res.status(201).json({
            success: true,
            message: 'To register Successfully, please check your email'
        });

    } catch (error) {
        res.status(400);
        throw new Error(error);
    }
})

// VERIFY EMAIL
exports.verifyEmail = asyncHandler(async (req, res) => {


    try {
        const _id = req.params._id;
        const reqtoken = req.params.token;

        const user = await User.findOne({ _id: _id });
        if (!user) {
            throw new Error();
        };

        const token = await Token.findOne({ user: _id, token: reqtoken });

        if (!token) {
            throw new Error();
        }

        await User.findByIdAndUpdate(_id, { isVerified: true })
        await Token.findByIdAndRemove(token._id)
        res.render('registerSuccess', {
            message: 'You are registered successfully',
            info: 'Please login in to continue'
        })

    } catch (error) {
        res.status(400)
        res.render('errorRequest', {
            error: '400 Bad Request',
            message: 'The request cannot be completed due to client error'
        })
    }
})

//  RESEND EMAIL VERIFICATION TOKEN
exports.resendEmailToken = (asyncHandler(async (req, res) => {

    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });

        if (!user) {
            res.status(404);
            throw new Error('We were unable to find a user with that email. Make sure your Email is correct!')
        };

        if (user.isVerified) {
            res.status(400)
            throw new Error('User is already registered. Please login in')
        };

        // Generate and save the token
        const token = user.createToken();

        const link = `${process.env.BASE_URL}/user/verifyEmail/${user._id}/${token.token}`

        //Send the email
        await sendEmail(user.email, link)

        res.status(201).json({
            success: true,
            message: 'To register Successfully, please check your email'
        });

    } catch (error) {
        res.status(400)
        throw new Error(error);
    }

}))


//  FORGOT PASSWORD VERIFICATION WITH EMAIL
exports.forgotPassword = asyncHandler(async (req, res) => {
    try {

        const email = req.body.email;

        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('We were unable to find a user with that email. Make sure your Email is correct!')
        }
        const token = await user.createToken()
        await user.save();

        // send token via email
        const link = `${process.env.BASE_URL}/user/resetPassword/${user._id}/${token.token}`
        await sendEmail(user.email, link)


        res.status(201).json({
            success: true,
            message: 'To register Successfully, please check your email'
        });
    } catch (e) {
        res.status(400);
        throw new Error(e);
    }
})

//    REDIRECT USER TO PASSWORD FIELD
exports.getResetPassword = asyncHandler(async (req, res) => {
    const _id = req.params._id;
    const token = req.params.token;
    try {
        // 
        // const user = await User.findById(_id);
        // if (!user) {
        // throw new Error();
        // }
        // 
        // const token = await Token.findOne({ token: token.token, user: _id });
        // if (!token) {
        // throw new Error();
        // }
        res.sendFile(path.join(__dirname, './../../public/html/resetPassword.html'))


    } catch (err) {
        res.status(400);
        throw new Error('Password reset token is invalid or has expired.');
    }
})

// RESET THE PASSWORD
exports.postResetPassword = async (req, res) => {
    console.log(req.body)
    console.log(req.params)
    res.status(200)
    res.send('hello world')
}
// LOGIN
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // CHECK FOR USER

    const user = await User.findOne({ email: email });

    if (!user || await user.passwordCompare(password) === false) {
        throw new Error('invalid credentials')
    }

    if (!user.isVerified) {
        throw new Error('The token is sent to your email.Please Verify your Email')
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
    res.status(200).json({
        success: true,
        user: user,
        token: token
    })
})

// GET ALL USERS
exports.getAllUsers = asyncHandler(async (req, res) => {

    const allUsers = await User.find({});
    if (allUsers.length === 0) {
        throw new Error('No users found')
    }
    res.status(200).json({
        success: true,
        users: allUsers
    })
})

// GET A USER
exports.getUser = asyncHandler(async (req, res) => {
    const _id = req.params._id

    const user = await User.findById(_id).populate('product').exec();


    if (!user) {
        res.status(404)
        throw new Error('User not found');
    }
    res.status(200).json({
        success: true,
        user: user
    })
})