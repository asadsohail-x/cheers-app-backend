import Timespans from "../models/TimespanModel";
import catchAsync from "../utils/catchAsync";

export const add = catchAsync(async (req, res, next) => {
  const timespanData = {
    unit: req.body.unit,
    duration: req.body.duration,
  };
  const existing = await Timespans.findOne(timespanData);
  if (existing) {
    return res.json({
      success: false,
      message: "Timepsn not found",
    });
  }

  const timespan = await Timespans.create(timespanData);
  if (!timespan) {
    throw new Error("Error! Timespan cannot be added");
  } else {
    return res.status(201).json({
      success: true,
      message: "Timespan added successfully",
      timespan,
    });
  }
});

export const update = catchAsync(async (req, res, next) => {
  const existing = await Timespans.findOne({ _id: req.body.id });
  if (!existing) {
    return next(new Error("Error! Timespan not Found"));
  }

  const timespan = await Timespans.findByIdAndUpdate(req.body.id, req.body, {
    new: true,
  });

  if (timespan) {
    return res.status(200).json({
      success: true,
      message: "Timespan updated successfully",
      timespan,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Error! Timespan could not be updated",
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const timespans = await Timespans.find();
  if (timespans.length > 0) {
    return res.status(201).json({
      success: true,
      message: "Timespans found",
      timespans,
    });
  }

  return next(new Error("Error! Timespans not found"));
});

export const get = catchAsync(async (req, res, next) => {
  const timespan = await Timespans.findOne({ _id: req.params.id });
  if (!timespan) {
    throw new Error("Error! Timespan Not Found");
  }

  return res.status(201).json({
    success: true,
    message: "Timespan found",
    timespan,
  });
});

export const del = catchAsync(async (req, res, next) => {
  const existing = await Timespans.findOne({ _id: req.body.id });
  if (!existing) {
    return next(new Error("Error! Timespan not Found"));
  }

  const timespan = await Timespans.findOneAndDelete({ _id: req.body.id });
  if (!timespan) {
    return next(new Error("Error! Timespan not found"));
  }

  return res.status(201).json({
    success: true,
    message: "Timespan deleted successfully",
    timespan,
  });
});
