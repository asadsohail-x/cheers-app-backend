import Plans from "../models/PlanModel";
import catchAsync from "../utils/catchAsync";

import mongoose from "mongoose";
import { planAggregate } from "../utils/aggregates";

export const add = catchAsync(async (req, res, next) => {
  const planData = {
    timespanId: req.body.timespanId,
    cost: req.body.cost,
    discount: req.body.discount,
  };

  const existing = await Plans.findOne(planData);
  if (existing) {
    return next(new Error("Error! Plan already exist"));
  }

  const plan = await Plans.create(planData);
  if (!plan) {
    return next(new Error("Error! Plan cannot be added"));
  }
  return res.status(201).json({
    success: true,
    message: "Plan added successfully",
    plan,
  });
});

const updatePlan = async (id, plan) => {
  let updatedPlan = null;
  const result = await Plans.findByIdAndUpdate(id, plan, { new: true });
  if (result) updatedPlan = await getPlan({ _id: result._id });
  return updatedPlan;
};

export const update = catchAsync(async (req, res, next) => {
  const existing = await Plans.findOne({ _id: req.body.id });
  if (!existing) {
    return next(new Error("Error! Plan not Found"));
  }

  const plan = await updatePlan(existing._id, req.body);

  if (plan) {
    return res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      plan,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Error! Plan could not be updated",
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const plans = await Plans.aggregate([
    {
      $match: { isDisabled: false },
    },
    ...planAggregate,
  ]);
  
  if (plans.length > 0) {
    return res.status(201).json({
      success: true,
      message: "Plans found",
      plans,
    });
  }
  return next(new Error("Error! Plans not found"));
});

export const get = catchAsync(async (req, res, next) => {
  const plans = await Plans.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.params.id),
      },
    },
    ...planAggregate,
  ]);
  if (plans.length > 0) {
    return res.status(201).json({
      success: true,
      message: "Plan found",
      plan: plans[0],
    });
  }

  return next(new Error("Error! Plan not found"));
});

export const del = catchAsync(async (req, res, next) => {
  const existing = await Plans.findOne({ _id: req.body.id });
  if (!existing) {
    return next(new Error("Error! Plan not Found"));
  }

  const deletedPlan = await Plans.findOneAndDelete({
    _id: req.body.id,
  });
  if (!deletedPlan) {
    return next(new Error("Error! Plan not found"));
  }

  return res.status(201).json({
    success: true,
    message: "Plan deleted successfully",
    plan: deletedPlan,
  });
});

export const disable = catchAsync(async (req, res, next) => {
  const existing = await Plans.findOne({ _id: req.body.id });
  if (!existing) return next(new Error("Error! Plan not Found"));
  if (existing.isDisabled)
    return next(new Error("Error! Plan already disabled"));

  const disabledPlan = await updatePlan(req.body.id, { isDisabled: true });
  if (!disabledPlan)
    return next(new Error("Error! Plan could not be disabled"));

  res.status(200).json({
    success: true,
    message: "Plan disabled successfully",
    plan: disabledPlan,
  });
});

export const enable = catchAsync(async (req, res, next) => {
  const existing = await Plans.findOne({ _id: req.body.id });
  if (!existing) return next(new Error("Error! Plan not Found"));
  if (!existing.isDisabled)
    return next(new Error("Error! Plan already enabled"));

  const enabledPlan = await updatePlan(req.body.id, { isDisabled: false });
  if (!enabledPlan) return next(new Error("Error! Plan could not be enabled"));

  res.status(200).json({
    success: true,
    message: "Plan enabled successfully",
    plan: enabledPlan,
  });
});

async function getPlans(query = null) {
  let _aggregate = query
    ? [
        {
          $match: { ...query },
        },
        ...planAggregate,
      ]
    : planAggregate;

  const result = await Plans.aggregate(_aggregate);

  return result;
}

async function getPlan(query) {
  const result = await getPlans(query);
  return result[0];
}
