const express = require('express');
const route = express.Router();
const UserServices = require('../../Services/userService')
const middleware = require('../../utils/Middleware_validation')

const { authenticate } = require('../Middleware/auth')
/***************Routes************/

//SignUp
route.post('/signup',
    middleware.SignupValidation,
    middleware.validationFunction,
    UserServices.SignUp);

//Login
route.post('/login',
    middleware.LoginValidation,
    middleware.validationFunction,
    UserServices.Login);

//AddtoWishList
route.post('/AddItemToWishList', authenticate, UserServices.AddItemToWishList);
//RemoveItemFromWishList
route.post('/RemoveItemFromWishList', authenticate, UserServices.RemoveItemFromWishList);
//GetWishList
route.post('/GetWishList', authenticate, UserServices.GetWishList);
//Get
route.get('/GetAllDrivers', UserServices.GetAllDrivers);

module.exports = route;