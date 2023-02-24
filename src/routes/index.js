const express = require('express');
const router = express.Router();
const productRoute = require('./productsRoute')
const userRoute = require('./userRoute')
const emailRoute = require('./emailRoutes');

const routeArray = [
    productRoute,
    userRoute,
    emailRoute,
]

routeArray.map((route) => {
    return router.use('/', route)
})

module.exports = router