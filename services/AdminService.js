import Admins from "../models/AdminModel";
import catchAsync from "../utils/catchAsync";
import { hash, check } from "../utils/Crypt";

export const add = catchAsync(async (req, res, next) => {
  const existing = await Admins.findOne({ email: req.body.email });
  if (existing) {
    return next(new Error("Error! Email already exists"));
  }

  const { password: pass } = req.body;

  const password = hash(pass);

  const admin = await Admins.create({ ...req.body, password });
  if (!admin) {
    throw new Error("Error! Admin cannot be added");
  } else {
    return res.status(201).json({
      success: true,
      message: "Admin added successfully",
      admin,
    });
  }
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const admin = await Admins.findOne({ email });
  if (!admin) return next(new Error("Incorrect Email"));
  if (check(admin.password, password))
    return next(new Error("Incorrect Password"));

  const token = jwt.sign(
    { id: admin._id, email: admin.email, role: "ADMIN" },
    process.env.JWT_SECRET,
    { expiresIn: "700h" }
  );

  return res.status(201).json({
    success: true,
    message: "Admin logged in successfully",
    admin: { id: admin._id, email: admin.email, token },
  });
});
