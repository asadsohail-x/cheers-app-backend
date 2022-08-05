const express = require("express");
const route = express.Router();
const {
  add,
  // update,
  getAll,
  get,
  del,
} = require("../../services/PlanService");
const { authenticate } = require("../Middleware/auth");

/***************Routes************/
route.post("/add", add);
// route.put("/update", update);
route.get("/getAll", getAll);
route.get("/get/:id", get);
route.delete("/delete", del);

module.exports = route;
