import { Router } from "express";
const route = Router();

import { add, login, updatePassword } from "../../services/AdminService";

/***************Routes************/
route.put("/add", add);
route.post("/login", login);
route.patch("/update-password", updatePassword);

export default route;
