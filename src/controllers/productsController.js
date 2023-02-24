const asyncHandler = require('express-async-handler');
const Product = require('./../models/productModel');
const APIFeatures = require('./../utils/apifeatures');

//CREATE PRODUCTS
exports.createProduct = asyncHandler(async (req, res) => {

    const reqData = req.body;
    const user = req.user;

    const product = new Product({
        user: user,
        ...reqData
    });

    await product.save();

    res.status(201).json({
        success: true,
        product: product
    })

})

// GE ALL PRODUCTS 
exports.getAllProducts = asyncHandler(async (req, res) => {

    try {

        // Get a query
        const features = new APIFeatures(Product.find({}), req.query).filter().sort().limitFields().paginate()

        //execute the query
        const products = await features.query // means => features.Product

        // console.log(products)

        res.status(200).json({
            success: true,
            documents: products.length,
            products
        })
    } catch (err) {
        res.status(404)
        throw new Error(err.message);
    }

})

// GET PRODUCTS BY ID
exports.getProductById = asyncHandler(async (req, res) => {

    const _id = req.params._id
    try {
        const product = await Product.findById(_id).populate({ path: 'user', select: ('fname lname cellNumber') })

        if (!product) {
            res.status(404)
            throw new Error('Product not found');
        }

        res.status(200).json({
            success: true,
            product
        })
    } catch (err) {
        throw new Error(err);
    }
})

// DELETE  PRODUCT BY ID
exports.deleteProductById = asyncHandler(async (req, res) => {
    const _id = req.params._id
    try {
        const product = await Product.findByIdAndDelete(_id);
        if (!product) {
            res.status(404)
            throw new Error('Product not found')
        }
        res.status(200).json({
            success: true,
            product
        })
    } catch (err) {
        throw new Error(err)
    }
})

// DELETE ALL THE PRODUCTS
exports.deleteAllProducts = asyncHandler(async (req, res) => {

    await Product.remove({})
    res.status(200).json({
        success: true,
        message: 'Products deleted successfully'
    })
})