import { Router } from "express";
const route = Router();
import {
  add,
  update,
  getAll,
  get,
  del,
  check,
} from "../../services/SubscriptionService";
// const { authenticate } = require("../middleware/auth");

/***************Routes************/
route.put("/add", add);
route.patch("/update", update);
route.get("/getAll", getAll);
route.get("/get/:id", get);
route.get("/check/:userId", check);
route.delete("/delete", del);

export default route;
