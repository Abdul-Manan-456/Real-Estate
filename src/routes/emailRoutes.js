const express = require('express');
const router = express.Router();

const { verifyEmail, resendEmailToken, forgotPassword, getResetPassword, postResetPassword } = require('./../controllers/userController')



// Verify the Email Address
router.get('/user/verifyEmail/:_id/:token', verifyEmail);
router.post('/user/resend-email-token', resendEmailToken);
router.post('/user/forgotPassword', forgotPassword);
router.get('/user/resetPassword/:_id/:token', getResetPassword);
router.post('/user/resetPassword/:_id/:token', postResetPassword);




module.exports = router