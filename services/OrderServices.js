const OrderModel = require('../models/OrderModel');
const userModel = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');


/***************Services************/

//Add
exports.Add = catchAsync(async (req, res, next) => {

    const Order = await OrderModel.create({ ...req.body })
    console.log("Order==>", Order)
    if (!Order) {
        throw new Error('Error! Order cannot be created');
    }
    else {

        const User = await userModel.find({ Email: req.body.Email })
        console.log("User", User)
        User[0].Order.push(Order._id)
        User[0].save(async () => {
            return res.status(201).json({
                success: true, message: "Order Placed Successfully"
            })
        })
    }

})

//Get All Orders of a specific User
exports.GetOrdersByUser = catchAsync(async (req, res, next) => {

    const data = await OrderModel.aggregate([
        {
            $lookup:
            {
                from: 'users',
                localField: 'AssignedRider',
                foreignField: '_id',
                as: 'AssignedRider'
            },
        },

        {
            $lookup:
            {
                from: 'items',
                localField: 'Items',
                foreignField: '_id',
                as: 'Items'
            }

        },
        {
            $match:
            {
                Email: req.body.Email
            }
        },

    ])
    console.log("===>>>", data)
    if (data.length > 0) {

        return res.status(200).json({
            success: true, message: "Orders Data Found", data
        })
    }
    else {
        throw new Error('Error! No Order Placed Yet');
    }


})

//Get All Orders on the search creteria of Status if it is pending approved or delevered
exports.GetOrderByStatus = catchAsync(async (req, res, next) => {

    const data = await OrderModel.aggregate([
        {
            $lookup:
            {
                from: 'users',
                localField: 'AssignedRider',
                foreignField: '_id',
                as: 'AssignedRider'
            },
        },

        {
            $lookup:
            {
                from: 'items',
                localField: 'Items',
                foreignField: '_id',
                as: 'Items'
            }

        },
        {
            $match:
            {
                Status: req.body.Status
            }
        },

    ])
    console.log("===>>>", data)
    if (data.length > 0) {

        return res.status(200).json({
            success: true, message: "Orders Data Found", data
        })
    }
    else {
        throw new Error('Error! No Order Placed Yet');
    }


})

//update status
exports.UpdateStatus = catchAsync(async (req, res, next) => {

    const Record = await OrderModel.updateOne({ "_id": req.body.Id }, { Status: req.body.Status });
    console.log(Record.nModified)
    if (Record.nModified > 0) {
        return res.status(200).json({
            success: true, message: `Order Status Updated to ${req.body.Status} Successfully`
        })
    }
    return res.status(500).json({
        success: false, message: "Error!  Order Status Not-Updated Successfully"
    })


})


//Get All Orders in DB
exports.GetAllOrders = catchAsync(async (req, res, next) => {

    const data = await OrderModel.aggregate([

        {
            $lookup:
            {
                from: 'items',
                localField: 'Items',
                foreignField: '_id',
                as: 'Items'
            },

        },
        {
            $lookup:
            {
                from: 'users',
                localField: 'AssignedRider',
                foreignField: '_id',
                as: 'AssignedRider'
            },
        }

    ])
    console.log("===>>>", data)
    if (data.length > 0) {

        return res.status(200).json({
            success: true, message: "Order Found Found", data
        })
    }
    else {
        throw new Error('Error! No Order Placed Yet');
    }


})

//AssignDriver to Order/ChangeDriver of Order
exports.AssignDriver = catchAsync(async (req, res, next) => {
    const Record = await OrderModel.updateOne({ "_id": req.body.Id }, { AssignedRider: req.body.AssignedRider });
    console.log(Record.nModified)
    if (Record.nModified > 0) {

        const User = await userModel.find({ "_id": req.body.AssignedRider })
        console.log("User", User)
        User[0].Order.push(req.body.Id)
        User[0].save(async () => {
            return res.status(200).json({
                success: true, message: "Driver Assigned Successfully"
            })
        })

       
    }
    else{
    return res.status(500).json({
        success: false, message: "Error!  Driver Not-Assigned Successfully"
    })
    }

})

//Get All Orders in DB
exports.GetOrderByDriver = catchAsync(async (req, res, next) => {

    const data = await userModel.aggregate([

        { 
            $lookup:
            {
                from: 'orders',
                localField: 'Order',
                foreignField: '_id',
                as: 'Order'
            },
        },
        {
            $match: { Email: req.body.Email}
        }

    ])
    console.log("===>>>", data) 
    if (data.length > 0) {

        return res.status(200).json({
            success: true, message: "Order Found for this Rider", data
        })
    }
    else {
        throw new Error('Error! No Order Assigned to this Rider Yet');
    }


})
