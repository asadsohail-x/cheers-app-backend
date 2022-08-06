const FilterPrefs = require("../models/FilterPref");
const catchAsync = require("../utils/catchAsync");

exports.get = catchAsync(async (req, res) => {
  const filterPrefs = await FilterPrefs.findOne();

  if (filterPrefs) return new Error("Error! Filter Preferences not found");

  return res.status(201).json({
    success: true,
    message: "Filter Preferences found",
    filterPrefs,
  });
});

exports.save = catchAsync(async (req, res) => {
  const existing = await FilterPrefs.findOne();

  let filterPrefs = null;

  if (!existing) filterPrefs = await new FilterPrefs({ ...req.body }).save();
  else
    filterPrefs = await FilterPrefs.findByIdAndUpdate(
      existing._id,
      { ...req.body },
      { new: true }
    );

  if (filterPrefs)
    res.status(201).json({
      success: true,
      message: "Filter Preferences saved",
      filterPrefs,
    });

  return new Error("Error! Filter Preferences could not be saved");
});
