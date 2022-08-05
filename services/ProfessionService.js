const Professions = require("../models/ProfessionModel");
const catchAsync = require("../utils/catchAsync");

//Add
exports.add = catchAsync(async (req, res, next) => {
  const existing = await Professions.findOne({ name: req.body.name });
  if (existing) {
    return next(new Error("Error! Profession with this name already exist"));
  }

  const profession = await Professions.create({ ...req.body });
  if (!profession) {
    throw new Error("Error! Profession cannot be added");
  } else {
    return res.status(201).json({
      success: true,
      message: "Profession added successfully",
      profession,
    });
  }
});

//Update
exports.update = catchAsync(async (req, res, next) => {
  const existing = await Professions.findOne({ _id: req.body.id });
  if (!existing) {
    return next(new Error("Error! Profession not Found"));
  }

  const profession = await Professions.findByIdAndUpdate(
    req.body.id,
    {
      name: req.body.name,
    },
    { new: true }
  );

  if (profession) {
    return res.status(200).json({
      success: true,
      message: "Profession updated successfully",
      profession,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Error! Profession could not be updated",
  });
});

//Get All
exports.getAll = catchAsync(async (req, res, next) => {
  const professions = await Professions.find();
  if (professions.length > 0) {
    return res.status(201).json({
      success: true,
      message: "Professions found",
      professions,
    });
  } else {
    throw new Error("Error! Professions not found");
  }
});

//Get One
exports.get = catchAsync(async (req, res, next) => {
  const profession = await Professions.findOne({ _id: req.params.id });
  if (!profession) {
    throw new Error("Error! Profession Not Found");
  }

  return res.status(201).json({
    success: true,
    message: "Profession found",
    profession,
  });
});

//Delete
exports.del = catchAsync(async (req, res, next) => {
  const existing = await Professions.findOne({ _id: req.body.id });
  if (!existing) {
    return next(new Error("Error! Profession not Found"));
  }

  const deletedProfession = await Professions.findOneAndDelete({
    _id: req.body.id,
  });
  if (!deletedProfession) {
    return next(new Error("Error! Profession not found"));
  }

  return res.status(201).json({
    success: true,
    message: "Profession deleted successfully",
    profession: deletedProfession,
  });
});
