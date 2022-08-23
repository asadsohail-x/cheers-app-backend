import Professions from "../models/ProfessionModel";
import catchAsync from "../utils/catchAsync";

export const add = catchAsync(async (req, res, next) => {
  const existing = await Professions.findOne({ name: req.body.name });
  if (existing) {
    return res.json({
      success: false,
      message: "Profession with name already exists",
    });
  }

  const profession = await Professions.create({ ...req.body });
  if (!profession) {
    return res.json({
      success: false,
      message: "Profession could not be added",
    });
  }

  return res.json({
    success: true,
    message: "Profession added successfully",
    profession,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const existing = await Professions.findOne({ _id: req.body.id });
  if (!existing) {
    return res.json({
      success: false,
      message: "Profession not found",
    });
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

  return res.json({
    success: false,
    message: "Profession could not be updated",
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const professions = await Professions.find();
  if (professions.length > 0) {
    return res.status(201).json({
      success: true,
      message: "Professions found",
      professions,
    });
  }

  return res.json({
    success: false,
    message: "Professions not found",
  });
});

export const get = catchAsync(async (req, res, next) => {
  const profession = await Professions.findOne({ _id: req.params.id });
  if (!profession) {
    return res.json({
      success: false,
      message: "Profession not found",
    });
  }

  return res.json({
    success: true,
    message: "Profession found",
    profession,
  });
});

export const del = catchAsync(async (req, res, next) => {
  const existing = await Professions.findOne({ _id: req.body.id });
  if (!existing) {
    return res.json({
      success: false,
      message: "Profession not found",
    });
  }

  const deletedProfession = await Professions.findOneAndDelete({
    _id: req.body.id,
  });
  if (!deletedProfession) {
    return res.json({
      success: false,
      message: "Profession could not be deleted",
    });
  }

  return res.json({
    success: true,
    message: "Profession deleted successfully",
    profession: deletedProfession,
  });
});
