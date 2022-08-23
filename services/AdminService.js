import Admins from "../models/AdminModel";
import catchAsync from "../utils/catchAsync";

import jwt from "jsonwebtoken";
import { hash, check } from "../utils/crypt";

export const add = catchAsync(async (req, res, next) => {
  const existing = await Admins.findOne({ email: req.body.email });
  if (existing) {
    return res.json({
      success: false,
      message: "Email already taken",
    });
  }

  const { password: pass } = req.body;

  const password = hash(pass);

  const admin = await Admins.create({ ...req.body, password });

  if (!admin) {
    return res.json({
      success: false,
      message: "Admin could not be created",
    });
  } else {
    return res.json({
      success: true,
      message: "Admin added successfully",
      admin,
    });
  }
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const admin = await Admins.findOne({ email });
  if (!admin) {
    return res.json({
      success: false,
      message: "Incorrect Email",
    });
  }
  if (!check(password, admin.password)) {
    return res.json({
      success: false,
      message: "Incorrect Password",
    });
  }

  const token = jwt.sign(
    { id: admin._id, email: admin.email, role: "ADMIN" },
    process.env.JWT_SECRET,
    { expiresIn: "700h" }
  );

  return res.json({
    success: true,
    message: "Admin logged in successfully",
    admin: {
      id: admin._id,
      email: admin.email,
      name: admin.name,
      token,
    },
  });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const existing = await Admins.findOne({ _id: req.body.id });
  if (!existing) {
    return res.json({
      success: false,
      message: "Admin not found",
    });
  }

  const admin = await Admins.findByIdAndUpdate(
    req.body.id,
    {
      password: hash(req.body.password),
    },
    { new: true }
  );

  if (!admin) {
    return res.json({
      success: false,
      message: "Password could not be updated",
    });
  }

  res.json({
    success: true,
    message: "Password updated successfully",
    admin: {
      id: admin._id,
      email: admin.email,
      name: admin.name,
    },
  });
});
