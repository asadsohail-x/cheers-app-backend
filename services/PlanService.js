const Plans = require("../models/PlanModel");
const catchAsync = require("../utils/catchAsync");

//Add
exports.add = catchAsync(async (req, res, next) => {
  const existing = await Plans.findOne({ name: req.body.name });
  if (existing) {
    return next(new Error("Error! Plan with this name already exist"));
  }

  const plan = await Plans.create({ ...req.body });
  if (!plan) {
    throw new Error("Error! Plan cannot be added");
  } else {
    return res.status(201).json({
      success: true,
      message: "Plan added successfully",
      plan,
    });
  }
});

// //Update
// exports.update = catchAsync(async (req, res, next) => {
//   const existing = await Professions.findOne({ _id: req.body.id });
//   if (!existing) {
//     return next(new Error("Error! Profession with this name not Found"));
//   }

//   const profession = await Professions.findByIdAndUpdate(
//     req.body.id,
//     {
//       name: req.body.name,
//     },
//     { new: true }
//   );

//   if (profession) {
//     return res.status(200).json({
//       success: true,
//       message: "Profession updated successfully",
//       profession,
//     });
//   }

//   return res.status(500).json({
//     success: false,
//     message: "Error! Profession could not be updated",
//   });
// });

//Get All
exports.getAll = catchAsync(async (req, res, next) => {
  const plans = await Plans.aggregate([
    {
      $lookup: {
        from: "timespantypes",
        localField: "timespan.id",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
        as: "timespan.type",
      },
    },
    {
      $unset: "timespan.id",
    },
    {
      $unwind: "$timespan.type",
    },
  ]);
  if (plans.length > 0) {
    return res.status(201).json({
      success: true,
      message: "Plans found",
      plans,
    });
  } else {
    throw new Error("Error! Plans not found");
  }
});

//Get One
exports.get = catchAsync(async (req, res, next) => {
  const plan = await Plans.aggregate([
    {
      $match: {
        _id: req.params.id,
      },
    },
    {
      $lookup: {
        from: "timespantypes",
        localField: "timespan.id",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
        as: "timespan.type",
      },
    },
    {
      $unset: "timespan.id",
    },
    {
      $unwind: "$timespan.type",
    },
  ]);
  if (!plan) {
    throw new Error("Error! Plan Not Found");
  }

  return res.status(201).json({
    success: true,
    message: "Plan found",
    plan,
  });
});

//Delete
exports.del = catchAsync(async (req, res, next) => {
  const existing = await Plans.findOne({ _id: req.body.id });
  if (!existing) {
    return next(new Error("Error! Plan not Found"));
  }

  const deletedPlan = await Plans.findOneAndDelete({
    _id: req.body.id,
  });
  if (!deletedPlan) {
    return next(new Error("Error! Plan not found"));
  }

  return res.status(201).json({
    success: true,
    message: "Plan deleted successfully",
    plan: deletedPlan,
  });
});