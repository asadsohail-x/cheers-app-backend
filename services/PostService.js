import Posts from "../models/PostModel";
import { postAggregate } from "../utils/aggregates";
import catchAsync from "../utils/catchAsync";
import mongoose from "mongoose";
import fs from "fs";

export const add = catchAsync(async (req, res, next) => {
  const added = await Posts.create({ ...req.body });
  if (!added) {
    return res.json({
      success: false,
      message: "Post could not be added",
    });
  }

  const post = await getPost({ _id: added._id });

  return res.json({
    success: true,
    message: "Post added successfully",
    post,
  });
});

export const getAllArchived = catchAsync(async (req, res, next) => {
  const { user } = req.query;

  if (!user) {
    return res.json({
      success: false,
      message: "User Id not provided",
    });
  }

  const posts = await getPosts({ userId: mongoose.Types.ObjectId(user) });

  if (posts.length <= 0) {
    return res.json({
      success: false,
      message: "Posts not found",
    });
  }

  res.json({
    success: true,
    message: "Posts found",
    posts,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const { user } = req.query;

  if (!user) {
    return res.json({
      success: false,
      message: "User Id not provided",
    });
  }

  const posts = await getPosts({
    userId: mongoose.Types.ObjectId(user),
    isArchived: false,
  });

  if (posts.length <= 0) {
    return res.json({
      success: false,
      message: "Posts not found",
    });
  }

  res.json({
    success: true,
    message: "Posts found",
    posts,
  });
});

export const get = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.json({
      success: false,
      message: "Id not provided",
    });
  }

  const post = await getPost({ _id: mongoose.Types.ObjectId(id) });

  if (!post) {
    return res.json({
      success: false,
      message: "Post not found",
    });
  }

  res.json({
    success: true,
    message: "Post found",
    post,
  });
});

export const updateDescription = catchAsync(async (req, res, next) => {
  const existing = await Posts.findOne({ _id: req.body.id });
  if (!existing) {
    return res.json({
      success: false,
      message: "Post not found",
    });
  }

  const updatedPost = await Posts.findByIdAndUpdate(
    req.body.id,
    { description: req.body.description },
    { new: true }
  );

  if (!updatedPost) {
    return res.json({
      success: false,
      message: "Post could not be updated",
    });
  }

  const post = await getPost({ _id: updatedPost._id });

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    post,
  });
});

export const archive = catchAsync(async (req, res, next) => {
  const existing = await Posts.findOne({ _id: req.body.id });
  if (!existing) {
    return res.json({
      success: false,
      message: "Post not found",
    });
  }
  if (existing.isArchived) {
    return res.json({
      success: false,
      message: "Post already archived",
    });
  }

  const archived = await Posts.findByIdAndUpdate(
    req.body.id,
    { isArchived: true },
    { new: true }
  );
  if (!archived) {
    return res.json({
      success: false,
      message: "Post could not be archived",
    });
  }

  res.json({
    success: true,
    message: "Post archived successfully",
    post: archived,
  });
});

export const unarchive = catchAsync(async (req, res, next) => {
  const existing = await Posts.findOne({ _id: req.body.id });
  if (!existing) {
    return res.json({
      success: false,
      message: "Post not found",
    });
  }
  if (!existing.isArchived) {
    return res.json({
      success: false,
      message: "Post already unarchived",
    });
  }

  const unarchived = await Posts.findByIdAndUpdate(
    req.body.id,
    { isArchived: false },
    { new: true }
  );
  if (!unarchived) {
    return res.json({
      success: false,
      message: "Post could not be unarchived",
    });
  }

  res.json({
    success: true,
    message: "Post unarchived successfully",
    post: unarchived,
  });
});

export const del = catchAsync(async (req, res, next) => {
  const existing = await Posts.findOne({ _id: req.body.id });
  if (!existing) {
    return res.json({
      success: false,
      message: "Post not found",
    });
  }

  const deleted = await Posts.findOneAndDelete({ _id: req.body.id });
  if (!deleted) {
    return res.json({
      success: false,
      message: "Post could not be deleted",
    });
  }

  //Delete all the swipe data
  deleted.media.forEach(
    (filePath) =>
      fs.existsSync(filePath) &&
      fs.unlinkSync(filePath, (e) => console.log(e || "Deleted: ", filePath))
  );

  return res.json({
    success: true,
    message: "Post deleted successfully",
    post: deleted,
  });
});

export const uploadMedia = catchAsync(async (req, res, next) => {
  if (!req.files.length) {
    return res.json({
      success: false,
      message: "Media could not be uploaded",
    });
  }

  const mediaURLs = [...req.files.map((m) => m.path)];
  res.json({ success: true, mediaURLs });
});

async function getPosts(query = null) {
  let _aggregate = query
    ? [
        {
          $match: { ...query },
        },
        ...postAggregate,
      ]
    : postAggregate;

  const result = await Posts.aggregate(_aggregate);
  return result;
}

async function getPost(query) {
  const result = await getPosts(query);
  return result[0];
}
