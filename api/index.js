import { Router } from "express";
const router = Router();

import genderRoutes from "./routes/gender.routes";
import professionRoutes from "./routes/profession.routes";
import userRoutes from "./routes/user.routes";
import swipeRoutes from "./routes/swipe.routes";
import filterPrefsRoutes from "./routes/filterPrefs.routes";
import callLogRoutes from "./routes/callLog.routes";
import timespanRoutes from "./routes/timespan.routes";
import planRoutes from "./routes/plan.routes";
import subscriptionRoutes from "./routes/subscription.routes";
// const Categories = require("./Routes/Categories");
// const Item = require("./Routes/Item");
// const Order = require("./Routes/Order");
// const Payment = require("./Routes/Payment");
// const ImageUpload = require("./Routes/ImageUpload");

/*********Main Api**********/
router.use("/genders", genderRoutes);
router.use("/professions", professionRoutes);
router.use("/users", userRoutes);
router.use("/swipes", swipeRoutes);
router.use("/filter-prefs", filterPrefsRoutes);
router.use("/call-logs", callLogRoutes);
router.use("/timespans", timespanRoutes);
router.use("/plans", planRoutes);
router.use("/subscriptions", subscriptionRoutes);
// router.use("/Categories", Categories);
// router.use("/Item", Item);
// router.use("/Order", Order);
// router.use("/Payment", Payment);
// router.use("/Upload", ImageUpload);

export default router;
