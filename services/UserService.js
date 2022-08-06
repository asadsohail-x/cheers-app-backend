const Users = require("../models/UserModel");
const { Types } = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const { deleteSwipes } = require("./SwipeService");

const userAggregate = [
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
  {
    $unset: ["genderId", "professionId"],
  },
  {
    $unwind: "$gender",
  },
  {
    $unwind: "$profession",
  },
];

//Add
exports.add = catchAsync(async (req, res, next) => {
  const isEmailUnique = await checkEmail(req.body.email);
  if (!isEmailUnique) return next(new Error("Error! Email already taken"));

  const isUsernameUnique = await checkUsername(req.body.username);
  if (!isUsernameUnique)
    return next(new Error("Error! Username already taken"));

  const user = await Users.create({ ...req.body });
  if (!user) {
    return next(new Error("Error! User cannot be added"));
  } else {
    return res.status(201).json({
      success: true,
      message: "User added successfully",
      user,
    });
  }
});

//Update
exports.update = catchAsync(async (req, res, next) => {
  const existing = await Users.findOne({ _id: req.body.id });
  if (!existing) return next(new Error("Error! User not Found"));

  const { id, email, username } = req.body;
  if (email) {
    if (email !== existing.email) {
      const isEmailUnique = await checkEmail(email);
      if (!isEmailUnique) return next(new Error("Error! Email already taken"));
    }
  }

  if (username) {
    if (username !== existing.username) {
      const isUsernameUnique = await checkUsername(username);
      if (!isUsernameUnique)
        return next(new Error("Error! Username already taken"));
    }
  }

  const updatedUser = await Users.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true }
  );

  if (updatedUser) {
    const user = await getUser({ _id: updatedUser._id });
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Error! User could not be updated",
  });
});

//Get All
exports.getAll = catchAsync(async (req, res, next) => {
  const users = await getUsers();
  if (users.length > 0) {
    return res.status(201).json({
      success: true,
      message: "Users found",
      users,
    });
  }
  return next(new Error(" Error! Users not found!"));
});

//Get One
exports.get = catchAsync(async (req, res, next) => {
  const user = await getUser({ _id: Types.ObjectId(req.params.id) });
  if (!user) return next(new Error("Error! User not found!"));

  return res.status(201).json({
    success: true,
    message: "User found",
    user,
  });
});

//Delete
exports.del = catchAsync(async (req, res, next) => {
  const existing = await Users.findOne({ _id: req.body.id });
  if (!existing) {
    return next(new Error("Error! User not Found"));
  }

  const deletedUser = await Users.findOneAndDelete({ _id: req.body.id });
  if (!deletedUser) return next(new Error("Error! User not found"));

  //Delete all the swipe data
  const deletedSwipes = await deleteSwipes(existing._id);
  console.log(deletedSwipes);

  return res.status(201).json({
    success: true,
    message: "User deleted successfully",
    user: deletedUser,
  });
});

exports.getPaginated = catchAsync(async (req, res, next) => {
  const { page, limit } = req.query;

  let users = [];
  var userAggregatePromise = Users.aggregate(userAggregate);

  if (page && limit) {
    const result = await Users.aggregatePaginate(userAggregatePromise, {
      page,
      limit,
    });
    users = [...result.docs];
  } else users = await userAggregatePromise;

  if (users.length <= 0) return next(new Error("Error! Users not found"));

  res.status(201).json({
    success: true,
    message: "Users found",
    users,
  });
});

exports.uploadPfp = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new Error("Error! Image upload failed"));
  const imagePath = req.file.path;
  res.json({ success: true, imagePath });
});

exports.updateLoc = catchAsync(async (req, res, next) => {
  const { id: _id, lat, long } = req.body;

  const existing = await Users.findOne({ _id });

  if (!existing) return next(new Error("Error! User not found"));

  const updatedUser = await Users.findByIdAndUpdate(
    _id,
    { $set: { "location.coordinates": [long, lat] } },
    { new: true }
  );

  if (!updatedUser)
    return next(new Error("Error! User Location could not be updated"));

  return res.status(201).json({
    success: true,
    message: "User location updated successfully",
    user: { _id: updatedUser._id, location: updatedUser.location.coordinates },
  });
});

async function checkEmail(email) {
  let result = await Users.find({ email });
  return !result.length;
}

async function checkUsername(username) {
  let result = await Users.find({ username });
  return !result.length;
}

async function getUsers(query = null) {
  let aggregate = query
    ? [
        {
          $match: { ...query },
        },
        ...userAggregate,
      ]
    : userAggregate;

  const users = await Users.aggregate(aggregate);

  return users;
}

async function getUser(query) {
  const users = await getUsers(query);
  return users[0];
}
