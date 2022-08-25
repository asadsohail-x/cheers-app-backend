import Swipes from "../models/SwipeModel";
import catchAsync from "../utils/catchAsync";
import mongoose from "mongoose";
import { getFilterPrefs } from "./FilterPrefService";

import { swipeAggregate } from "../utils/aggregates";

const { Types } = mongoose;

//Add
export const add = catchAsync(async (req, res, next) => {
  const { swiperId, swipedId, swipeType } = req.body;

  if (swiperId === swipedId) {
    return res.json({
      success: false,
      message: "User cannot swipe oneself",
    });
  }

  const swipeData = {
    swiperId,
    swipedId,
    swipeType: swipeType ? swipeType.toUpperCase() === "RIGHT" : false,
  };

  const existing = await Swipes.findOne(swipeData);
  if (existing) {
    return res.json({
      success: false,
      message: "Swipe already exists",
    });
  }

  const addedSwipe = await Swipes.create(swipeData);
  if (!addedSwipe) {
    return res.json({
      success: false,
      message: "Swipe could not be added",
    });
  }

  const swipe = await getSwipe({ _id: addedSwipe._id });

  return res.json({
    success: true,
    message: "Swipe added successfully",
    swipe,
  });
});

//Get One
export const get = catchAsync(async (req, res, next) => {
  const swipe = await getSwipe({ _id: mongoose.Types.ObjectId(req.params.id) });
  if (!swipe) {
    return res.json({
      success: false,
      message: "Swipe not found",
    });
  }

  return res.json({
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
  const existing = await Swipes.findOne({ _id: req.query.id });
  if (!existing) {
    return res.json({
      success: false,
      message: "Swipe not found",
    });
  }

  const deletedSwipe = await Swipes.findOneAndDelete({
    _id: req.query.id,
  });

  if (!deletedSwipe) {
    return res.json({
      success: false,
      message: "Swipe could not be deleted",
    });
  }

  return res.json({
    success: true,
    message: "Swipe deleted successfully",
    swipe: deletedSwipe,
  });
});

export const delByUser = catchAsync(async (req, res, next) => {
  //Delete all the swipe data
  const deleteResult = await deleteSwipes(req.query.user);
  console.log(deleteResult);
  if (!deleteResult?.deleteCount) {
    return res.json({
      success: false,
      message: "Swipes could not be deleted",
    });
  }

  return res.json({
    success: true,
    message: "Swipes deleted successfully",
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const { page, limit, user, swipeType } = req.query;

  const filterPrefs = await getFilterPrefs();
  const _aggregate = [];

  const query = {};
  if (user) query.swiperId = Types.ObjectId(user);
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

  if (swipes.length <= 0) {
    return res.json({
      success: false,
      message: "Swipes not found",
    });
  }

  res.json({
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
