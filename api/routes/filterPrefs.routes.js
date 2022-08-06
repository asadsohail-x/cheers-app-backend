const express = require("express");
const route = express.Router();
const { get, save } = require("../../services/FilterPrefService");

route.patch("/save", save);
route.get("/get", get);

module.exports = route;
