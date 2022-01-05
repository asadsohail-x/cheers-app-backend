const express = require('express');
const route = express.Router();
const CategoriesService = require('../../Services/CategoriesService')
const { authenticate, restrictTo } = require('../Middleware/auth')
/***************Routes************/


route.post('/Add', authenticate, CategoriesService.Add);
route.post('/Update', authenticate,  CategoriesService.Update);
route.post('/AddItem', authenticate,  CategoriesService.AddItem);
route.post('/DeleteItem', authenticate,  CategoriesService.DeleteItem);
route.get('/GetAll',  CategoriesService.GetAll);
route.post('/GetOne', CategoriesService.GetOne);

module.exports = route;