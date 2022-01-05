const CategoriesModel = require('../models/CategoriesModel');
const ItemModel = require('../models/ItemModel');
const catchAsync = require('../utils/catchAsync');


/***************Services************/

//Add
exports.Add = catchAsync(async (req, res, next) => {

    const Categories = await CategoriesModel.find({ Name: req.body.Name })
    if (Categories.length < 1) {

        const Record = await CategoriesModel.create({ ...req.body })
        if (!Record) {
            throw new Error('Error! Category cannot be created');
        }
        else {
            return res.status(201).json({
                success: true, message: "Category Added Successfully", Record
            })
        }


    }
    else {
        return next(new Error('Error! Category with this Name already exist'))

    }

})

//Add Item to Category
exports.AddItem = catchAsync(async (req, res, next) => {

    const Categories = await CategoriesModel.find({ Name: req.body.Name })

    if (Categories.length > 0) {

        Categories[0].Item.map(items => {

            if (items == req.body.Id) {

                throw new Error('Error! Item already added in this Category')
            }
        })
        Categories[0].Item.push(req.body.Id)
        Categories[0].save(async () => {
            const ItemResponse = await ItemModel.updateOne({ "_id": req.body.Id }, { Category: req.body.Name });
            if (ItemResponse.nModified > 0) {
                return res.status(201).json({
                    success: true, message: "Item Added to this Category  Successfully"
                })
            }
            return res.status(500).json({
                success: false, message: "Error!  Item Not Added"
            })

        })


    }
    else {
        return next(new Error('Error! Category with this Name Not Found'))

    }

})

//Delete Item from Category
exports.DeleteItem = catchAsync(async (req, res, next) => {

    const Categories = await CategoriesModel.find({ Name: req.body.Name })

    if (Categories.length > 0) {


        const index = Categories[0].Item.indexOf(req.body.Id);
        console.log(index)
        if (index > -1) {
            Categories[0].Item.splice(index, 1)
            Categories[0].save(async () => {
                const ItemResponse = await ItemModel.updateOne({ "_id": req.body.Id }, { Category: "" });
                if (ItemResponse.nModified > 0) {
                    return res.status(201).json({
                        success: true, message: "Item Deleted from this category Successfully"
                    })
                }
                return res.status(500).json({
                    success: false, message: "Error!  Item Not Deleted"
                })

            })
        } else {
            return next(new Error('Error! Item not found in this category'))
        }




    }
    else {
        return next(new Error('Error! Category with this Name Not Found'))

    }

})


//Update
exports.Update = catchAsync(async (req, res, next) => {

    const Response = await CategoriesModel.find({ Name: req.body.Name })
    if (Response.length > 0) {

        const Record = await CategoriesModel.updateOne({ Name: req.body.Name }, { ...req.body });
        console.log(Record.nModified)
        if (Record.nModified > 0) {
            return res.status(200).json({
                success: true, message: "Category Updated Successfully"
            })
        }
        return res.status(500).json({
            success: false, message: "Error!  Category Not-Updated Successfully"
        })


    }
    else {
        return next(new Error('Error! Category with this Name not Found'))

    }

})

//GetAll
exports.GetAll = catchAsync(async (req, res, next) => {

    const data = await CategoriesModel.aggregate([
        {
            $lookup:
            {
                from: 'items',
                localField: 'Item',
                foreignField: '_id',
                as: 'Item'
            },
        },

    ])
    if (data.length > 0) {
        console.log("===>>>", data)
        return res.status(201).json({
            success: true, message: "Data Found", data
        })
    }
    else {
        throw new Error('Error! Data Not Found');
    }

})
//GetOne
exports.GetOne = catchAsync(async (req, res, next) => {

    const data = await CategoriesModel.aggregate(

      [  {
            $match: {
                "Name": req.body.Name
            }
        }, {
                $lookup:
                {
                    from: 'items',
                    localField: 'Item',
                    foreignField: '_id',
                    as: 'Item'
                },
            }



    ])
    if (data.length > 0) {
        console.log("===>>>", data)
        return res.status(201).json({
            success: true, message: "Data Found", data
        })
    }
    else {
        throw new Error('Error! Data Not Found');
    }

})