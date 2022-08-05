const express = require("express");
const route = express.Router();
const {
  add,
  getAll,
  del,
  delByUser
} = require("../../services/SwipeService");
// const { authenticate } = require("../middleware/auth");

/***************Routes************/
route.put("/add", add);
// route.patch("/update", update);
route.get("/getAll", getAll);
// route.get("/get/:id", get);
route.delete("/delete", del);
route.delete("/delete/user/:id", delByUser);

module.exports = route;
