const express = require("express");
const route = express.Router();
const {
  add,
  update,
  get,
  del,
  getPaginated,
} = require("../../services/UserService");
// const { authenticate } = require("../Middleware/auth");

/***************Routes************/
route.put("/add", add);
route.patch("/update", update);
route.get("/getAll", getPaginated);
route.get("/get/:id", get);
route.delete("/delete", del);

module.exports = route;
