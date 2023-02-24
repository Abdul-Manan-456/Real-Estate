const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { createUser, loginUser, updateUser, getAllUsers, getUser } = require('../controllers/userController');


router.post('/user', createUser)
router.get('/user/:_id', getUser)
router.get('/allUsers', auth, getAllUsers)
// router.put('/user', updateUser)
router.post('/login', loginUser)





module.exports = router