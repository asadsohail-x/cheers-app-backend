import Users from "../models/UserModel";
import OTPs from "../models/OTPModel";

import { getFilterPrefs } from "../services/FilterPrefService";

import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync";
import { deleteSwipes } from "./SwipeService";

import { userAggregate } from "../utils/aggregates";

import jwt from "jsonwebtoken";
import { hash, check } from "../utils/crypt";

import { getEmailBody, sendMail } from "../utils/mailer";

const { Types } = mongoose;

//Login
export const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ username });
  if (!user) {
    return res.json({
      success: false,
      message: "Incorrect Username",
    });
  }

  if (!check(password, user.password)) {
    return res.json({
      success: false,
      message: "Incorrect Password",
    });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, username: user.username, role: "USER" },
    process.env.JWT_SECRET,
    { expiresIn: "700h" }
  );

  return res.json({
    success: true,
    message: "User logged in successfully",
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      name: `${user.firstName} ${user.lastName}`,
      token,
    },
  });
});

//Add
export const add = catchAsync(async (req, res, next) => {
  const isEmailUnique = await checkEmail(req.body.email);
  if (!isEmailUnique) {
    return res.json({
      success: false,
      message: "Email already taken",
    });
  }

  const isUsernameUnique = await checkUsername(req.body.username);
  if (!isUsernameUnique) {
    return res.json({
      success: false,
      message: "Username already taken",
    });
  }

  const user = await Users.create({ ...req.body });
  if (!user) {
    return res.json({
      success: false,
      message: "User could not be added",
    });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, username: user.username, role: "USER" },
    process.env.JWT_SECRET,
    { expiresIn: "700h" }
  );

  return res.json({
    success: true,
    message: "User signed up successfully",
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      name: `${user.firstName} ${user.lastName}`,
      token,
    },
  });
});

const updateUser = async (id, user) => {
  let updatedUser = null;
  const result = await Users.findByIdAndUpdate(id, user, { new: true });
  if (result) updatedUser = await getUser({ _id: result._id });
  return updatedUser;
};

//Update
export const update = catchAsync(async (req, res, next) => {
  const existing = await Users.findOne({ _id: req.body.id });
  if (!existing) {
    return res.json({
      success: false,
      message: "User not found",
    });
  }

  const { id, email, username } = req.body;
  if (email) {
    if (email !== existing.email) {
      const isEmailUnique = await checkEmail(email);
      if (!isEmailUnique) {
        return res.json({
          success: false,
          message: "Email already taken",
        });
      }
    }
  }

  if (username) {
    if (username !== existing.username) {
      const isUsernameUnique = await checkUsername(username);
      if (!isUsernameUnique) {
        return res.json({
          success: false,
          message: "Username already taken",
        });
      }
    }
  }

  const user = await updateUser(id, req.body);

  if (user) {
    return res.json({
      success: true,
      message: "User updated successfully",
      user,
    });
  }

  return res.json({
    success: false,
    message: "User could not be updated",
  });
});

//Get One
export const get = catchAsync(async (req, res, next) => {
  const { lat, long } = req.query;

  let user = null;

  if (lat && long) {
    const result = await Users.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(long), parseFloat(lat)],
          },
          distanceMultiplier: 0.000621371 * 1.61,
          distanceField: "distance",
          spherical: true,
        },
      },
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.query.id),
        },
      },
      ...userAggregate,
    ]);

    user = result[0];
  } else {
    user = await getUser({
      _id: mongoose.Types.ObjectId(req.query.id),
      isBlocked: false,
    });
  }

  if (!user) {
    return res.json({
      success: false,
      message: "User not found",
    });
  }

  return res.json({
    success: true,
    message: "User found",
    user,
  });
});

//Delete
export const del = catchAsync(async (req, res, next) => {
  const existing = await Users.findOne({ _id: req.body.id });
  if (!existing) {
    return res.json({
      success: false,
      message: "User not found",
    });
  }

  const deletedUser = await Users.findOneAndDelete({ _id: req.body.id });
  if (!deletedUser) {
    return res.json({
      success: false,
      message: "User could not be deleted",
    });
  }

  //Delete all the swipe data
  const deletedSwipes = await deleteSwipes(existing._id);
  console.log(deletedSwipes);

  return res.json({
    success: true,
    message: "User deleted successfully",
    user: deletedUser,
  });
});

export const getPaginated = catchAsync(async (req, res, next) => {
  const {
    page,
    limit,
    lat,
    long,
    name,
    radius,
    sortByPosts,
    gender: genderId,
    min_age: minAge,
    max_age: maxAge,
  } = req.query;

  const filterPrefs = await getFilterPrefs();
  const _aggregate = [];

  const query = {};
  if (genderId) query.genderId = Types.ObjectId(genderId);
  else if (minAge)
    query.age = maxAge ? { $gte: minAge, $lte: maxAge } : { $gte: minAge };
  else if (maxAge) query.age = { $lte: maxAge };

  if (lat && long) {
    _aggregate.push(
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
        },
      },
    );
  }

  if (Boolean(sortByPosts) === true) {
    _aggregate.push(
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "userId",
          pipeline: [
            {
              $project: {
                _id: 0,
              }
            }
          ],
          as: "posts",
        },
      },
      {
        $set: {
          postCount: { $size: "$posts" },
        }
      },
      {
        $unset: "posts"
      },
      {
        $sort: { postCount: -1 }
      }
    );
  }

  if (name) {
    _aggregate.push({
      $match: {
        $or: [
          { firstName: { $regex: `${name}`, $options: "i" } },
          { lastName: { $regex: `${name}`, $options: "i" } }
        ]
      }
    });
  }

  _aggregate.push({
    $match: query,
  });

  _aggregate.push({
    $match: { isBlocked: false },
  });

  _aggregate.push(...userAggregate);

  var userAggregatePromise = Users.aggregate(_aggregate);
  const result = await Users.aggregatePaginate(userAggregatePromise, {
    page: page || 1,
    limit: limit || filterPrefs.filterLimit,
  });

  let users = [...result.docs];

  if (users.length <= 0) {
    return res.json({
      success: false,
      message: "Users not found",
    });
  }

  res.status(201).json({
    success: true,
    message: "Users found",
    users,
  });
});

export const uploadPfp = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return res.json({
      success: false,
      message: "Image could not be uploaded",
    });
  }

  const imagePath = req.file.path;
  res.json({ success: true, imagePath });
});

export const updateLoc = catchAsync(async (req, res, next) => {
  const { id: _id, lat, long } = req.body;

  const existing = await Users.findOne({ _id });

  if (!existing) {
    return res.json({
      success: false,
      message: "User not found",
    });
  }

  const updatedUser = await Users.findByIdAndUpdate(
    _id,
    { $set: { "location.coordinates": [long, lat] } },
    { new: true }
  );

  if (!updatedUser) {
    return res.json({
      success: false,
      message: "User Location could not be updated",
    });
  }

  return res.json({
    success: true,
    message: "User location updated successfully",
    user: { _id: updatedUser._id, location: updatedUser.location.coordinates },
  });
});

export const block = catchAsync(async (req, res, next) => {
  const existing = await Users.findOne({ _id: req.body.id });
  if (!existing) {
    return res.json({
      success: false,
      message: "User not found",
    });
  }

  if (existing.isBlocked) {
    return res.json({
      success: false,
      message: "User already blocked",
    });
  }

  const blockedUser = await updateUser(req.body.id, { isBlocked: true });
  if (!blockedUser) {
    return res.json({
      success: false,
      message: "User could not be blocked",
    });
  }

  res.json({
    success: true,
    message: "User blocked successfully",
    user: blockedUser,
  });
});

export const unblock = catchAsync(async (req, res, next) => {
  const existing = await Users.findOne({ _id: req.body.id });
  if (!existing) {
    return res.json({
      success: false,
      message: "User not found",
    });
  }

  if (!existing.isBlocked) {
    return res.json({
      success: false,
      message: "User already unblocked",
    });
  }

  const user = await updateUser(req.body.id, { isBlocked: false });
  if (!user) {
    return res.json({
      success: false,
      message: "User could not be unblocked",
    });
  }

  res.json({
    success: true,
    message: "User unblocked successfully",
    user,
  });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const { id, password, oldPassword } = req.body;
  const existing = await Users.findOne({ _id: id });
  if (!existing) {
    return res.json({
      success: false,
      message: "User not found",
    });
  }

  if (oldPassword) {
    if (!check(oldPassword, existing.password)) {
      return res.json({
        success: false,
        message: "Old Password is incorrect",
      });
    }
  }

  const user = await updateUser(id, {
    password: hash(password),
  });

  if (!user) {
    return res.json({
      success: false,
      message: "Password could not be updated",
    });
  }

  res.json({
    success: true,
    message: "Password updated successfully",
    user,
  });
});

export const generateOTP = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const existing = await Users.findOne({ email });
  if (!existing) {
    return res.json({
      success: false,
      message: "User not found",
    });
  }

  // generate a unique OTP
  const OTP = getRandomNumber(1000, 9999);
  const htmlBody = getEmailBody(OTP);

  sendMail(email, htmlBody, "Email Verifications");

  // store the OTP to the server
  const createdOTP = await OTPs.create({ email, OTP });

  return res.json({
    success: true,
    message: `Email sent to successfully to: ${email}`,
    id: createdOTP._id,
  });
});

export const verifyOTP = catchAsync(async (req, res, next) => {
  const { id, enteredOTP } = req.body;

  const existing = await OTPs.findOne({ _id: id });
  if (!existing) {
    return res.json({
      success: false,
      message: "OTP not found",
    });
  }

  const { createdAt, expiresIn } = existing;

  const currentDate = new Date();
  const differenceInMS = +currentDate - +createdAt;
  const minutesSinceCreation = differenceInMS / 1000 / 60;

  console.log(minutesSinceCreation);

  if (minutesSinceCreation > expiresIn) {
    return res.json({ success: false, message: "OTP has expired" });
  }

  if (existing.OTP !== parseFloat(enteredOTP)) {
    return res.json({ success: false, message: "Invalid OTP" });
  }

  const user = await Users.findOne({ email: existing.email });

  return res.json({
    success: true,
    message: "OTP verified successfully",
    userId: user._id,
  });
});

const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

async function checkEmail(email) {
  let result = await Users.find({ email });
  return !result.length;
}

async function checkUsername(username) {
  let result = await Users.find({ username });
  return !result.length;
}

async function getUsers(query = null) {
  let _aggregate = query
    ? [
      {
        $match: { ...query },
      },
      ...userAggregate,
    ]
    : userAggregate;

  const users = await Users.aggregate(_aggregate);

  return users;
}

async function getUser(query) {
  const users = await getUsers(query);
  return users[0];
}
