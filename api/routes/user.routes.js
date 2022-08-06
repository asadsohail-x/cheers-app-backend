const express = require("express");
const route = express.Router();
const {
  add,
  update,
  get,
  del,
  getPaginated,
  uploadPfp,
  updateLoc,
} = require("../../services/UserService");

const imageUploader = require("../../utils/userPfpUploader");
// const { authenticate } = require("../Middleware/auth");

/***************Routes************/
route.put("/add", add);
route.patch("/update", update);
route.get("/getAll", getPaginated);
route.get("/get/:id", get);
route.delete("/delete", del);
route.patch("/updateLoc", updateLoc);
route.put(
  "/upload-pfp",
  (...rest) => imageUploader("profile-photo", ...rest),
  uploadPfp
);

module.exports = route;
