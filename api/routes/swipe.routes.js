import { Router } from "express";
const route = Router();
import { add, getAll, get, del, delByUser } from "../../services/SwipeService";
// const { authenticate } = require("../middleware/auth");

/***************Routes************/
route.put("/add", add);
route.get("/getAll", getAll);
route.get("/get/:id", get);
route.delete("/delete", del);
route.delete("/delete/user", delByUser);

export default route;
