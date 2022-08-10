import Swipes from "../models/SwipeModel";
import catchAsync from "../utils/catchAsync";
import mongoose from "mongoose";
import { getFilterPrefs } from "./FilterPrefService";

import { swipeAggregate } from "../utils/aggregates";

//Add
export const add = catchAsync(async (req, res, next) => {
  const { swiperId, swipedId, swipeType } = req.body;

  if (swiperId === swipedId) {
    return next(new Error("Error! Cannot swipe yourself"));
  }

  const swipeData = {
    swiperId,
    swipedId,
    swipeType: swipeType ? swipeType.toUpperCase() === "RIGHT" : false,
  };

  const existing = await Swipes.findOne(swipeData);
  if (existing) {
    return next(new Error("Error! Swipe already exist"));
  }

  const addedSwipe = await Swipes.create(swipeData);
  if (!addedSwipe) {
    return next(new Error("Error! Swipe cannot be added"));
  }

  const swipe = await getSwipe({ _id: addedSwipe._id });

  return res.status(201).json({
    success: true,
    message: "Swipe added successfully",
    swipe,
  });
});

//Get One
export const get = catchAsync(async (req, res, next) => {
  const swipe = await getSwipe({ _id: mongoose.Types.ObjectId(req.params.id) });
  if (!swipe) {
    return next(new Error("Error! Swipe Not Found"));
  }

  return res.status(201).json({
    success: true,
    message: "Swipe found",
    swipe,
  });
});

// Delete Swipe Utility Function
export const deleteSwipes = async (userId) => {
  const result = await Swipes.deleteMany({
    $or: [{ swiperId: userId }, { swipedId: userId }],
  });

  return result;
};

//Delete
export const del = catchAsync(async (req, res, next) => {
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

export const delByUser = catchAsync(async (req, res, next) => {
  //Delete all the swipe data
  const deleteResult = await deleteSwipes(req.body.user);
  console.log(deleteResult);
  if (!deleteResult?.deleteCount)
    return next(new Error("Swipes could not be deleted"));

  return res.status(201).json({
    success: true,
    message: "Swipes deleted successfully",
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const { page, limit, user, swipeType } = req.query;

  const filterPrefs = await getFilterPrefs();
  const _aggregate = [];

  const query = {};
  if (user) query.swiperId = user;
  if (swipeType) query.swipeType = swipeType.toUpperCase() === "RIGHT";

  if (query) {
    _aggregate.push({
      $match: query,
    });
  }

  _aggregate.push(...swipeAggregate);

  var swipeAggregatePromise = Swipes.aggregate(_aggregate);
  const result = await Swipes.aggregatePaginate(swipeAggregatePromise, {
    page: page || 1,
    limit: limit || filterPrefs.filterLimit,
  });

  let swipes = [...result.docs];

  if (swipes.length <= 0) return next(new Error("Error! Swipes not found"));

  res.status(201).json({
    success: true,
    message: "Swipes found",
    swipes,
  });
});

async function getSwipes(query = null) {
  let _aggregate = query
    ? [
        {
          $match: { ...query },
        },
        ...swipeAggregate,
      ]
    : swipeAggregate;

  const swipes = await Swipes.aggregate(_aggregate);
  return swipes;
}

async function getSwipe(query) {
  const swipes = await getSwipes(query);
  return swipes[0];
}
