const express = require('express');
const route = express.Router();
const OrderServices = require('../../Services/OrderServices')
const { authenticate } = require('../Middleware/auth')
/***************Routes************/


route.post('/Add', authenticate, OrderServices.Add);
route.post('/GetOrdersByUser', authenticate, OrderServices.GetOrdersByUser);
route.post('/GetOrderByStatus', authenticate, OrderServices.GetOrderByStatus);
route.post('/GetOrderByDriver', authenticate, OrderServices.GetOrderByDriver);
route.post('/UpdateStatus', authenticate, OrderServices.UpdateStatus);
route.get('/GetAll', authenticate, OrderServices.GetAllOrders);
route.post('/AssignDriver', authenticate, OrderServices.AssignDriver);

module.exports = route;