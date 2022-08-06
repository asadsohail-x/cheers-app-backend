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
    throw new Error("Error! User cannot be added");
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
      if (!isEmailUnique) throw new Error("Error! Email already taken");
    }
  }

  if (username) {
    if (username !== existing.username) {
      const isUsernameUnique = await checkUsername(username);
      if (!isUsernameUnique) throw new Error("Error! Username already taken");
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
  throw new Error("Error! Users not found");
});

//Get One
exports.get = catchAsync(async (req, res, next) => {
  const user = await getUser({ _id: Types.ObjectId(req.params.id) });
  if (!user) throw new Error("Error! User Not Found");

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

exports.getPaginated = catchAsync(async (req, res) => {
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

  res.status(201).json({
    success: true,
    message: "Users found",
    users,
  });

  return new Error("Error! Users Not found");
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
