import Genders from "../models/GenderModel";
import catchAsync from "../utils/catchAsync";

export const add = catchAsync(async (req, res, next) => {
  const existing = await Genders.findOne({ name: req.body.name });
  if (existing) {
    return next(new Error("Error! Gender with this name already exist"));
  }

  const gender = await Genders.create({ ...req.body });
  if (!gender) {
    throw new Error("Error! Gender cannot be added");
  } else {
    return res.status(201).json({
      success: true,
      message: "Gender added successfully",
      gender,
    });
  }
});

export const update = catchAsync(async (req, res, next) => {
  const existing = await Genders.findOne({ _id: req.body.id });
  if (!existing) {
    return next(new Error("Error! Gender not Found"));
  }

  const gender = await Genders.findByIdAndUpdate(
    req.body.id,
    {
      name: req.body.name,
    },
    { new: true }
  );

  if (gender) {
    return res.status(200).json({
      success: true,
      message: "Gender updated successfully",
      gender,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Error! Gender could not be updated",
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const genders = await Genders.find();
  if (genders.length > 0) {
    return res.status(201).json({
      success: true,
      message: "Genders found",
      genders,
    });
  } else {
    throw new Error("Error! Genders not found");
  }
});

export const get = catchAsync(async (req, res, next) => {
  const gender = await Genders.findOne({ _id: req.params.id });
  if (!gender) {
    throw new Error("Error! Gender Not Found");
  }

  return res.status(201).json({
    success: true,
    message: "Gender found",
    gender,
  });
});

export const del = catchAsync(async (req, res, next) => {
  const existing = await Genders.findOne({ _id: req.body.id });
  if (!existing) {
    return next(new Error("Error! Gender not Found"));
  }

  const deletedGender = await Genders.findOneAndDelete({ _id: req.body.id });
  if (!deletedGender) {
    return next(new Error("Error! Gender not found"));
  }

  return res.status(201).json({
    success: true,
    message: "Gender deleted successfully",
    gender: deletedGender,
  });
});
