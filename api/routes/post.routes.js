import { Router } from "express";
const route = Router();
import {
  uploadMedia,
  archive,
  unarchive,
  add,
  getAll,
  getAllArchived,
  get,
  del,
} from "../../services/PostService";

import imageUploader from "../../utils/postUploader";
import auth from "../middleware/auth";

route.get("/getAll", auth, getAll);
route.get("/get-archived", auth, getAllArchived);
route.get("/get/:id", auth, get);
route.put("/add", auth, add);
route.delete("/delete", auth, del);
route.patch("/archive", auth, archive);
route.patch("/unarchive", auth, unarchive);

route.put(
  "/upload-media",
  [auth, (...rest) => imageUploader("post-media", 9, ...rest)],
  uploadMedia
);

export default route;
