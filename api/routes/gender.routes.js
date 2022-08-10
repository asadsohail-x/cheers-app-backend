import { Router } from "express";
const route = Router();
import { add, update, getAll, get, del } from "../../services/GenderService";
// const { authenticate } = require("../middleware/auth");

/***************Routes************/
route.put("/add", add);
route.patch("/update", update);
route.get("/getAll", getAll);
route.get("/get/:id", get);
route.delete("/delete", del);

export default route;
