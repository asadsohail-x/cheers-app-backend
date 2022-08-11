import Posts from "../models/PostModel";
import { postAggregate } from "../utils/aggregates";
import catchAsync from "../utils/catchAsync";

import fs from "fs";

export const add = catchAsync(async (req, res, next) => {
  const post = await Posts.create({ ...req.body });
  if (!post) {
    return next(new Error("Error! Post cannot be added"));
  }

  return res.status(201).json({
    success: true,
    message: "Post added successfully",
    post,
  });
});

export const getAllArchived = catchAsync(async (req, res, next) => {
  const { user } = req.query;

  if (!user) return next(new Eror("Error! User Id not provided"));

  const posts = await getPosts({ userId: user });

  if (posts.length <= 0) return next(new Error("Error! Posts not found"));

  res.status(201).json({
    success: true,
    message: "Posts found",
    posts,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const { user } = req.query;

  if (!user) return next(new Eror("Error! User Id not provided"));

  const posts = await getPosts({ userId: user, isArchived: false });

  if (posts.length <= 0) return next(new Error("Error! Posts not found"));

  res.status(201).json({
    success: true,
    message: "Posts found",
    posts,
  });
});

export const get = catchAsync(async (req, res, next) => {
  const { id: _id } = req.params;

  if (!_id) return next(new Eror("Error! Id not provided"));

  const post = await getPost({ _id });

  if (!post) return next(new Error("Error! Posts not found"));

  res.status(201).json({
    success: true,
    message: "Post found",
    post,
  });
});

export const updateDescription = catchAsync(async (req, res, next) => {
  const existing = await Posts.findOne({ _id: req.body.id });
  if (!existing) return next(new Error("Error! Post not Found"));

  const updatedPost = await Users.findByIdAndUpdate(
    id,
    { description: req.body.description },
    { new: true }
  );

  if (!updatedPost) return next(new Error("Error! Post could not be updated"));
  const post = await getPost({ _id: updatedPost._id });

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    post,
  });
});

export const archive = catchAsync(async (req, res, next) => {
  const existing = await Posts.findOne({ _id: req.body.id });
  if (!existing) return next(new Error("Error! Post not found"));
  if (existing.isArchived)
    return next(new Error("Error! Post already archived"));

  const archived = await updateUser(req.body.id, { isArchived: true });
  if (!archived) return next(new Error("Error! Post could not be archived"));

  const post = await getPost({ _id: archived.id });

  res.status(200).json({
    success: true,
    message: "Post archived successfully",
    post,
  });
});

export const unarchive = catchAsync(async (req, res, next) => {
  const existing = await Posts.findOne({ _id: req.body.id });
  if (!existing) return next(new Error("Error! Post not found"));
  if (!existing.isArchived)
    return next(new Error("Error! Post already unarchived"));

  const unarchived = await updateUser(req.body.id, { isArchived: true });
  if (!unarchived)
    return next(new Error("Error! Post could not be unarchived"));

  const post = await getPost({ _id: unarchived.id });

  res.status(200).json({
    success: true,
    message: "Post unarchived successfully",
    post,
  });
});

export const del = catchAsync(async (req, res, next) => {
  const existing = await Posts.findOne({ _id: req.body.id });
  if (!existing) {
    return next(new Error("Error! Post not Found"));
  }

  const deleted = await Posts.findOneAndDelete({ _id: req.body.id });
  if (!deleted) return next(new Error("Error! Post not found"));

  //Delete all the swipe data
  deleted.media.forEach((filePath) =>
    fs.unlinkSync(filePath, (e) => console.log(e || "Deleted: ", filePath))
  );

  return res.status(201).json({
    success: true,
    message: "Post deleted successfully",
    post: deleted,
  });
});

export const uploadMedia = catchAsync(async (req, res, next) => {
  if (!req.files.length) return next(new Error("Error! Media not uploaded."));

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
