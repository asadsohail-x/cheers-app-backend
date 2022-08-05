const TimespanTypes = require("../models/TimespanTypeModel");
const catchAsync = require("../utils/catchAsync");

//Add
exports.add = catchAsync(async (req, res, next) => {
  const existing = await TimespanTypes.findOne({ name: req.body.name });
  if (existing) {
    return next(new Error("Error! Timespan Type with this name already exist"));
  }

  const timespanType = await TimespanTypes.create({ ...req.body });
  if (!timespanType) {
    throw new Error("Error! Timespan Type cannot be added");
  } else {
    return res.status(201).json({
      success: true,
      message: "Timespan Type added successfully",
      timespanType,
    });
  }
});

//Update
exports.update = catchAsync(async (req, res, next) => {
  const existing = await TimespanTypes.findOne({ _id: req.body.id });
  if (!existing) {
    return next(new Error("Error! Timespan Type not Found"));
  }

  const timespanType = await TimespanTypes.findByIdAndUpdate(
    req.body.id,
    {
      name: req.body.name,
    },
    { new: true }
  );

  if (timespanType) {
    return res.status(200).json({
      success: true,
      message: "Timespan Type updated successfully",
      timespanType,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Error! Timespan Type could not be updated",
  });
});

//Get All
exports.getAll = catchAsync(async (req, res, next) => {
  const timespanTypes = await TimespanTypes.find();
  if (timespanTypes.length > 0) {
    return res.status(201).json({
      success: true,
      message: "Timespan Type found",
      timespanTypes,
    });
  } else {
    throw new Error("Error! Timespan Type not found");
  }
});

//Get One
exports.get = catchAsync(async (req, res, next) => {
  const timespanTypes = await TimespanTypes.findOne({ _id: req.params.id });
  if (!timespanTypes) {
    throw new Error("Error! Timespan Type Not Found");
  }

  return res.status(201).json({
    success: true,
    message: "Timespan Type found",
    timespanTypes,
  });
});

//Delete
exports.del = catchAsync(async (req, res, next) => {
  const existing = await TimespanTypes.findOne({ _id: req.body.id });
  if (!existing) {
    return next(new Error("Error! Timespan Type not Found"));
  }

  const deletedTimespanType = await TimespanTypes.findOneAndDelete({
    _id: req.body.id,
  });
  if (!deletedTimespanType) {
    return next(new Error("Error! Timespan Type not found"));
  }

  return res.status(201).json({
    success: true,
    message: "Timespan Type deleted successfully",
    timespanType: deletedTimespanType,
  });
});
