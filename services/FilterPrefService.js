const FilterPrefs = require("../models/FilterPrefModel");
const catchAsync = require("../utils/catchAsync");

const get = catchAsync(async (req, res, next) => {
  const filterPrefs = await getFilterPrefs();
  
  if (!filterPrefs) return next(new Error("Error! FilterPrefs not found!"));

  return res.status(201).json({
    success: true,
    message: "Filter Preferences found",
    filterPrefs,
  });
});

const getFilterPrefs = async () => {
  const existing = await FilterPrefs.findOne();

  let createdFilterPrefs = null;
  if (!existing) createdFilterPrefs = await new FilterPrefs().save();

  return existing ? existing : createdFilterPrefs;
};

const save = catchAsync(async (req, res) => {
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

module.exports = {
  get,
  getFilterPrefs,
  save,
};
