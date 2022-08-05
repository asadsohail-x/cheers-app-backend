const Swipes = require("../models/SwipeModel");
const catchAsync = require("../utils/catchAsync");

const userAggregate = [
  // Join with Professions Collection
  {
    $lookup: {
      from: "professions",
      localField: "professionId",
      foreignField: "_id",
      pipeline: [
        {
          $project: {
            _id: 1,
            name: 1,
          },
        },
      ],
      as: "profession",
    },
  },
  // Join with Genders Collection
  {
    $lookup: {
      from: "genders",
      localField: "genderId",
      foreignField: "_id",
      pipeline: [
        {
          $project: {
            _id: 1,
            name: 1,
          },
        },
      ],
      as: "gender",
    },
  },
  // Determining which fields to respond with
  {
    $project: {
      _id: 1,
      firstName: 1,
      lastName: 1,
      location: 1,
      profession: 1,
      gender: 1,
    },
  },
  {
    $unwind: "$profession",
  },
  {
    $unwind: "$gender",
  },
];

const swipeAggregate = [
  {
    $lookup: {
      from: "users",
      localField: "swiperId",
      foreignField: "_id",
      pipeline: userAggregate,
      as: "swiper",
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "swipedId",
      foreignField: "_id",
      pipeline: userAggregate,
      as: "swiped",
    },
  },
  {
    $unset: ["swiperId", "swipedId"],
  },
  {
    $unwind: "$swiper",
  },
  {
    $unwind: "$swiped",
  },
];

//Add
exports.add = catchAsync(async (req, res, next) => {
  const existing = await Swipes.findOne({
    swipedId: req.body.swipedId,
    swiperId: req.body.swiperId,
    swipeType: req.body.swipeType,
  });
  if (existing) {
    return next(new Error("Error! Swipe already exist"));
  }

  const swipe = await Swipes.create({ ...req.body });
  if (!swipe) {
    throw new Error("Error! Swipe cannot be added");
  } else {
    return res.status(201).json({
      success: true,
      message: "Swipe added successfully",
      swipe,
    });
  }
});

//Get All
exports.getAll = catchAsync(async (req, res, next) => {
  const swipes = await Swipes.aggregate(swipeAggregate);
  if (swipes.length > 0) {
    return res.status(201).json({
      success: true,
      message: "Swipes found",
      swipes,
    });
  } else {
    throw new Error("Error! Swipes not found");
  }
});

//Get One
// exports.get = catchAsync(async (req, res, next) => {
//   const timespanTypes = await TimespanTypes.findOne({ _id: req.params.id });
//   if (!timespanTypes) {
//     throw new Error("Error! Timespan Type Not Found");
//   }

//   return res.status(201).json({
//     success: true,
//     message: "Timespan Type found",
//     timespanTypes,
//   });
// });

//Delete
exports.del = catchAsync(async (req, res, next) => {
  const existing = await Swipes.findOne({ _id: req.body.id });
  if (!existing) {
    return next(new Error("Error! Swipe not Found"));
  }

  const deletedSwipe = await Swipes.findOneAndDelete({
    _id: req.body.id,
  });
  if (!deletedSwipe) {
    return next(new Error("Error! Swipe not found"));
  }

  return res.status(201).json({
    success: true,
    message: "Swipe deleted successfully",
    swipe: deletedSwipe,
  });
});

exports.delByUser = catchAsync(async (req, res, next) => {
  //Delete all the swipe data
  const deleteResult = await deleteSwipes(req.params.id);
  console.log(deleteResult);
  if (!deleteResult.deleteCount) throw new Error("Swipes could not be deleted");

  return res.status(201).json({
    success: true,
    message: "Swipes deleted successfully",
  });
});

async function deleteSwipes(userId) {
  const result = await Swipes.find({
    $or: [{ swiperId: userId }, { swipedId: userId }],
  });

  return result;
}

exports.deleteSwipes = deleteSwipes;
