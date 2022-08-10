import CallLogs from "../models/CallLogModel";
import catchAsync from "../utils/catchAsync";
import mongoose from "mongoose";

import { callLogAggregate } from "../utils/aggregates";

//Add
export const add = catchAsync(async (req, res, next) => {
  const { callerId, receiverId, startTime, endTime } = req.body;

  const callLogData = {
    callerId,
    receiverId,
    startTime,
    endTime,
  };

  const existing = await CallLogs.findOne(callLogData);
  if (existing) {
    return next(new Error("Error! Call Log already exist"));
  }

  const addedCallLog = await CallLogs.create(callLogData);
  if (!addedCallLog) {
    throw new Error("Error! Call Log cannot be added");
  }

  const callLog = await getCallLog({ _id: addedCallLog._id });

  return res.status(201).json({
    success: true,
    message: "Call Log added successfully",
    callLog,
  });
});

//Get One
export const get = catchAsync(async (req, res, next) => {
  const callLog = await getCallLog({
    _id: mongoose.Types.ObjectId(req.params.id),
  });
  if (!callLog) {
    return next(new Error("Error! Call Log Not Found"));
  }

  return res.status(201).json({
    success: true,
    message: "Call Log found",
    callLog,
  });
});

// Delete Swipe Utility Function
export const deleteCallLogs = async (userId) => {
  const result = await CallLogs.deleteMany({
    $or: [{ callerId: userId }, { receiverId: userId }],
  });

  return result;
};

//Delete
export const del = catchAsync(async (req, res, next) => {
  const existing = await CallLogs.findOne({ _id: req.body.id });
  if (!existing) {
    return next(new Error("Error! Call Log not Found"));
  }

  const deletedCallLog = await CallLogs.findOneAndDelete({
    _id: req.body.id,
  });
  if (!deletedCallLog) {
    return next(new Error("Error! Call Log not found"));
  }

  return res.status(201).json({
    success: true,
    message: "Call Log deleted successfully",
    callLog: deletedCallLog,
  });
});

export const delByUser = catchAsync(async (req, res, next) => {
  //Delete all the swipe data
  const deleteResult = await deleteCallLogs(req.body.user);
  console.log(deleteResult);

  if (!deleteResult?.deletedCount)
    return next(new Error("Call Logs could not be deleted"));

  return res.status(201).json({
    success: true,
    message: "Call Logs deleted successfully",
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const { user } = req.query;

  const _aggregate = [];

  const query = {};
  if (user) query.callerId = mongoose.Types.ObjectId(user);

  if (query) {
    _aggregate.push({
      $match: query,
    });
  }

  _aggregate.push(...callLogAggregate);

  var callLogs = await CallLogs.aggregate(_aggregate);

  if (callLogs.length <= 0)
    return next(new Error("Error! Call Logs not found"));

  res.status(201).json({
    success: true,
    message: "Call Logs found",
    callLogs,
  });
});

async function getCallLogs(query = null) {
  let _aggregate = query
    ? [
        {
          $match: { ...query },
        },
        ...callLogAggregate,
      ]
    : callLogAggregate;

  const result = await CallLogs.aggregate(_aggregate);
  return result;
}

async function getCallLog(query) {
  const result = await getCallLogs(query);
  return result[0];
}
