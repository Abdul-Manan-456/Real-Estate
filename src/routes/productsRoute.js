const express = require('express');
const router = express.Router();
const auth = require('./../middleWares/authMiddleware');
const { createProduct, getAllProducts, getProductById, deleteProductById, deleteAllProducts } = require('./../controllers/productsController');

router.post('/product', auth, createProduct);
router.get('/product/all', auth, getAllProducts);
router.delete('/product/all', auth, deleteAllProducts);
router.get('/product/:_id', auth, getProductById);
router.delete('/product/:_id', auth, deleteProductById);



module.exports = router