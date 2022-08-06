const Users = require("../models/UserModel");
const { getFilterPrefs } = require("../services/FilterPrefService");

const { Types } = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const { deleteSwipes } = require("./SwipeService");

const userAggregate = [
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
  // Removing fields
  {
    $unset: ["genderId", "professionId", "password"],
  },
  // Destructure gender array
  {
    $unwind: "$gender",
  },
  // Destructure profession array
  {
    $unwind: "$profession",
  },
];

//Add
const add = catchAsync(async (req, res, next) => {
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

const updateUser = async (id, user) => {
  let updatedUser = null;
  const result = await Users.findByIdAndUpdate(id, user, { new: true });
  if (result) updatedUser = await getUser({ _id: result._id });
  return updatedUser;
};

//Update
const update = catchAsync(async (req, res, next) => {
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

  const updatedUser = await updateUser(id, req.body);

  if (updatedUser) {
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
const getAll = catchAsync(async (req, res, next) => {
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
const get = catchAsync(async (req, res, next) => {
  const user = await getUser({ _id: Types.ObjectId(req.params.id) });
  if (!user) return next(new Error("Error! User not found!"));

  return res.status(201).json({
    success: true,
    message: "User found",
    user,
  });
});

//Delete
const del = catchAsync(async (req, res, next) => {
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

const getPaginated = catchAsync(async (req, res, next) => {
  const {
    page,
    limit,
    lat,
    long,
    radius,
    gender: genderId,
    min_age: minAge,
    max_age: maxAge,
  } = req.query;

  const filterPrefs = await getFilterPrefs();
  const aggregate = [];

  const query = {};
  if (genderId) query.genderId = genderId;
  else if (minAge)
    query.age = maxAge ? { $gte: minAge, $lte: maxAge } : { $gte: minAge };
  else if (maxAge) query.age = { $lte: maxAge };

  if (lat && long) {
    aggregate.push(
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(long), parseFloat(lat)],
          },
          maxDistance: (radius || filterPrefs.radius) * 1000,
          distanceMultiplier: 0.000621371 * 1.61,
          distanceField: "distance",
          spherical: true,

          query,
        },
      },
      {
        $limit: (page || 1) * (limit || filterPrefs.filterLimit),
      }
    );
  } else {
    aggregate.push({
      $match: query,
    });
  }

  aggregate.push(...userAggregate);

  var userAggregatePromise = Users.aggregate(aggregate);
  const result = await Users.aggregatePaginate(userAggregatePromise, {
    page: page || 1,
    limit: limit || filterPrefs.filterLimit,
  });

  let users = [...result.docs];

  if (users.length <= 0) return next(new Error("Error! Users not found"));

  res.status(201).json({
    success: true,
    message: "Users found",
    users,
  });
});

const uploadPfp = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new Error("Error! Image upload failed"));
  const imagePath = req.file.path;
  res.json({ success: true, imagePath });
});

const updateLoc = catchAsync(async (req, res, next) => {
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

const block = catchAsync(async (req, res, next) => {
  const existing = await Users.findOne({ _id: req.body.id });
  if (!existing) return next(new Error("Error! User not Found"));
  if (existing.isBlocked) return next(new Error("Error! User already blocked"));

  const blockedUser = await updateUser(req.body.id, { isBlocked: true });
  if (!blockedUser) return next(new Error("Error! User could not be blocked"));

  res.status(200).json({
    success: true,
    message: "User blocked successfully",
    user: blockedUser,
  });
});

const unblock = catchAsync(async (req, res, next) => {
  const existing = await Users.findOne({ _id: req.body.id });
  if (!existing) return next(new Error("Error! User not Found"));
  if (!existing.isBlocked)
    return next(new Error("Error! User already unblocked"));

  const user = await updateUser(req.body.id, { isBlocked: false });
  if (!user) return next(new Error("Error! User could not be blocked"));

  res.status(200).json({
    success: true,
    message: "User unblocked successfully",
    user,
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

module.exports = {
  add,
  update,
  get,
  del,
  getPaginated,
  uploadPfp,
  updateLoc,
  userAggregate,
  block,
  unblock,
};
