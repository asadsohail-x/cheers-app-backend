import { Router } from "express";
const route = Router();
import {
  login,
  add,
  update,
  updatePassword,
  get,
  del,
  getPaginated,
  uploadPfp,
  updateLoc,
  block,
  unblock,
} from "../../services/UserService";

import imageUploader from "../../utils/userPfpUploader";
import auth from "../middleware/auth";

/* 
  * This approach is better but I'm not using it just because it is a little bit less readable for other devs 

  **  -> Start

  // const unAuthenticatedRoute = [
  //   { path: "/login", controller: login, method: "post" },
  //   { path: "/add", controller: add, method: "put" },
  // ];

  // const authenticatedRoute = [
  //   { path: "/update", controller: update, method: "patch" },
  //   { path: "/update-password", controller: updatePassword, method: "patch" },
  //   { path: "/getAll", controller: getPaginated, method: "get" },
  //   { path: "/get/:id", controller: get, method: "get" },
  //   { path: "/delete", controller: del, method: "delete" },
  //   { path: "/updateLoc", controller: updateLoc, method: "patch" },
  //   { path: "/block", controller: block, method: "patch" },
  //   { path: "/unblock", controller: unblock, method: "patch" },
  //   {
  //     path: "/upload-pfp",
  //     controller: uploadPfp,
  //     middleware: [(...rest) => imageUploader("profile-photo", ...rest)],
  //     method: "put",
  //   },
  // ];

  // unAuthenticatedRoute.forEach(({ path, controller, method }) => {
  //   route[method](path, controller);
  // });

  // authenticatedRoute.forEach(({ path, middleware, controller, method }) => {
  //   route[method](path, middleware ? [auth, ...middleware] : auth, controller);
  // });

  **  -> End
*/

/***************Routes************/
route.post("/login", login);
route.put("/add", add);
route.patch("/update", auth, update);
route.patch("/update-password", auth, updatePassword);
route.get("/getAll", auth, getPaginated);
route.get("/get/:id", auth, get);
route.delete("/delete", auth, del);
route.patch("/updateLoc", auth, updateLoc);
route.patch("/block", auth, block);
route.patch("/unblock", auth, unblock);
route.put(
  "/upload-pfp",
  [auth, (...rest) => imageUploader("profile-photo", ...rest)],
  uploadPfp
);

export default route;
