import { Router } from "express";
const route = Router();
import {
  add,
  update,
  get,
  del,
  getPaginated,
  uploadPfp,
  updateLoc,
  block,
  unblock,
} from "../../services/UserService";

import imageUploader from "../../utils/userPfpUploader";
// const { authenticate } = require("../Middleware/auth");

/***************Routes************/
route.put("/add", add);
route.patch("/update", update);
route.get("/getAll", getPaginated);
route.get("/get/:id", get);
route.delete("/delete", del);
route.patch("/updateLoc", updateLoc);
route.patch("/block", block);
route.patch("/unblock", unblock);
route.put(
  "/upload-pfp",
  (...rest) => imageUploader("profile-photo", ...rest),
  uploadPfp
);

export default route;
