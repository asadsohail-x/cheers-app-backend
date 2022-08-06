import FilterPrefService from "../../services/FilterPrefService";

const express = require("express");
const route = express.Router();
const { get, save } = require("../../services/SwipeService");

route.patch("/save", save);
route.get("/get", get);
