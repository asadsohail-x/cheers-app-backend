import Genders from "../models/GenderModel";
import catchAsync from "../utils/catchAsync";

export const add = catchAsync(async (req, res, next) => {
  const existing = await Genders.findOne({ name: req.body.name });
  if (existing) {
    return res.json({
      success: false,
      message: "Gender with this name already exists",
    });
  }

  const gender = await Genders.create({ ...req.body });
  if (!gender) {
    return res.json({
      success: false,
      message: "Gender could not be added",
    });
  }

  return res.json({
    success: true,
    message: "Gender added successfully",
    gender,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const existing = await Genders.findOne({ _id: req.body.id });
  if (!existing) {
    return res.json({
      success: false,
      message: "Gender not found",
    });
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

  return res.json({
    success: false,
    message: "Gender could not be updated",
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
  }

  return res.json({
    success: false,
    message: "Genders not found",
  });
});

export const get = catchAsync(async (req, res, next) => {
  const gender = await Genders.findOne({ _id: req.params.id });
  if (!gender) {
    return res.json({
      success: false,
      message: "Gender not found",
    });
  }

  return res.json({
    success: true,
    message: "Gender found",
    gender,
  });
});

export const del = catchAsync(async (req, res, next) => {
  const existing = await Genders.findOne({ _id: req.body.id });
  if (!existing) {
    return res.json({
      success: false,
      message: "Gender not found",
    });
  }

  const deletedGender = await Genders.findOneAndDelete({ _id: req.body.id });
  if (!deletedGender) {
    return res.json({
      success: false,
      message: "Gender could not be deleted",
    });
  }

  return res.json({
    success: true,
    message: "Gender deleted successfully",
    gender: deletedGender,
  });
});
