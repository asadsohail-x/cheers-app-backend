const express = require('express');
const router = express.Router();

//Required api's 

const User = require('./Routes/User')
const Categories = require('./Routes/Categories')
const Item = require('./Routes/Item')
const Order = require('./Routes/Order')
const Payment = require('./Routes/Payment')
const ImageUpload = require('./Routes/ImageUpload')

/*********Main Api**********/
router.use('/user',User);
router.use('/Categories', Categories);
router.use('/Item', Item);
router.use('/Order', Order);
router.use('/Payment', Payment);
router.use('/Upload', ImageUpload);

module.exports = router;