const express = require('express');
const route = express.Router();
const ItemService = require('../../services/ItemService')
const { authenticate, C} = require('../Middleware/auth')
/***************Routes************/


route.post('/Add', authenticate, ItemService.Add);
route.post('/Update', authenticate,  ItemService.Update);
route.get('/GetAll',  ItemService.GetAll);
route.post('/GetOne', ItemService.GetOne);
route.post('/Delete', authenticate, ItemService.Delete);


module.exports = route;