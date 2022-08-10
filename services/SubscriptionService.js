import Subscriptions from "../models/SubscriptionModel";
import catchAsync from "../utils/catchAsync";

import mongoose from "mongoose";
import { subscriptionAggregate } from "../utils/aggregates";

export const add = catchAsync(async (req, res, next) => {
  const subscriptionData = {
    planId: req.body.planId,
    userId: req.body.userId,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
  };

  const valid = await checkValidity(subscriptionData.userId);
  if (valid) return next(new Error("Error! User subscribed already"));

  const subscription = await Subscriptions.create(subscriptionData);
  if (!subscription) {
    return next(new Error("Error! Subscription cannot be added"));
  }
  return res.status(201).json({
    success: true,
    message: "Subscription added successfully",
    subscription,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const existing = await Subscriptions.findOne({ _id: req.body.id });
  if (!existing) {
    return next(new Error("Error! Subscription not Found"));
  }

  const subscription = await Subscriptions.findByIdAndUpdate(
    existing._id,
    req.body,
    {
      new: true,
    }
  );

  if (subscription) {
    return res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      subscription,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Error! Subscription could not be updated",
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const subscriptions = await Subscriptions.aggregate(subscriptionAggregate);
  if (subscriptions.length > 0) {
    return res.status(201).json({
      success: true,
      message: "Subscriptions found",
      subscriptions,
    });
  }
  return next(new Error("Error! Subscriptions not found"));
});

export const get = catchAsync(async (req, res, next) => {
  const subscriptions = await Subscriptions.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.params.id),
      },
    },
    ...subscriptionAggregate,
  ]);
  if (subscriptions.length > 0) {
    return res.status(201).json({
      success: true,
      message: "Subscription found",
      subscription: subscriptions[0],
    });
  }

  return next(new Error("Error! Plan not found"));
});

export const del = catchAsync(async (req, res, next) => {
  const existing = await Subscriptions.findOne({ _id: req.body.id });
  if (!existing) {
    return next(new Error("Error! Subscription not Found"));
  }

  const deleted = await Subscriptions.findOneAndDelete({
    _id: req.body.id,
  });
  if (!deleted) {
    return next(new Error("Error! Subscription not found"));
  }

  return res.status(201).json({
    success: true,
    message: "Subscription deleted successfully",
    subscription: deleteds,
  });
});

const findExistingSubscription = async (userId) => {
  const subscriptions = await Subscriptions.find({
    userId,
  }).sort({ created_at: -1 });

  if (subscriptions.length <= 0) return null;

  return subscriptions[0];
};

const checkValidity = async (userId) => {
  const subscription = await findExistingSubscription(userId);

  if (!subscription) return false;

  const endDateTime = new Date(Date.parse(subscription.endTime));
  const currentDateTime = new Date(Date.now());

  return endDateTime > currentDateTime;
};

export const check = catchAsync(async (req, res, next) => {
  const valid = await checkValidity(req.params.userId);

  if (!valid)
    return res.status(500).json({
      success: false,
      valid,
      message: "Error! Subscription not found",
    });

  return res.status(201).json({
    success: true,
    valid,
    message: "Subscription is valid.",
  });
});
