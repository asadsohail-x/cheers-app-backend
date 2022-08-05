const express = require("express");
const route = express.Router();
const {
  add,
  update,
  getAll,
  get,
  del,
  getUserAggregate
} = require("../../services/UserService");
// const { authenticate } = require("../Middleware/auth");


/***************Routes************/
route.put("/add", add);
route.patch("/update", update);
route.get("/getAll", getAll);
route.get("/get/:id", get);
route.delete("/delete", del);

module.exports = route;
