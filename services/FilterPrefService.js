import FilterPrefs from "../models/FilterPrefModel";
import catchAsync from "../utils/catchAsync";

export const get = catchAsync(async (req, res, next) => {
  const filterPrefs = await getFilterPrefs();

  if (!filterPrefs) return next(new Error("Error! FilterPrefs not found!"));

  return res.status(201).json({
    success: true,
    message: "Filter Preferences found",
    filterPrefs,
  });
});

export const getFilterPrefs = async () => {
  const existing = await FilterPrefs.findOne();

  let createdFilterPrefs = null;
  if (!existing) createdFilterPrefs = await FilterPrefs.create();

  return existing ? existing : createdFilterPrefs;
};

export const save = catchAsync(async (req, res) => {
  const existing = await FilterPrefs.findOne();

  let filterPrefs = null;

  if (!existing) filterPrefs = await FilterPrefs.create({ ...req.body });
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