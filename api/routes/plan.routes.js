const express = require("express");
const route = express.Router();
const {
  add,
  // update,
  getAll,
  get,
  del,
} = require("../../services/PlanService");
// const { authenticate } = require("../middleware/auth");

/***************Routes************/
route.put("/add", add);
// route.patch("/update", update);
route.get("/getAll", getAll);
route.get("/get/:id", get);
route.delete("/delete", del);

module.exports = route;
