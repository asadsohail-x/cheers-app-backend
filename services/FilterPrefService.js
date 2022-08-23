import FilterPrefs from "../models/FilterPrefModel";
import catchAsync from "../utils/catchAsync";

export const get = catchAsync(async (req, res, next) => {
  const filterPrefs = await getFilterPrefs();

  if (!filterPrefs) {
    return res.json({
      success: false,
      message: "Filter Preferences not found",
    });
  }

  return res.json({
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
    res.json({
      success: true,
      message: "Filter Preferences saved",
      filterPrefs,
    });

  return res.json({
    success: false,
    message: "Filter Preferences could be not saved",
  });
});
