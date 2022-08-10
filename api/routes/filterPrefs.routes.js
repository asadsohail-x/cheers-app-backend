import { Router } from "express";
const route = Router();
import { get, save } from "../../services/FilterPrefService";

route.patch("/save", save);
route.get("/get", get);

export default route;
