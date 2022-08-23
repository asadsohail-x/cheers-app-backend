import { Router } from "express";
const router = Router();

import auth from "./middleware/auth";

import genderRoutes from "./routes/gender.routes";
import professionRoutes from "./routes/profession.routes";
import userRoutes from "./routes/user.routes";
import swipeRoutes from "./routes/swipe.routes";
import filterPrefsRoutes from "./routes/filterPrefs.routes";
import callLogRoutes from "./routes/callLog.routes";
import timespanRoutes from "./routes/timespan.routes";
import planRoutes from "./routes/plan.routes";
import subscriptionRoutes from "./routes/subscription.routes";
import adminRoutes from "./routes/admin.routes";
import postRoutes from "./routes/post.routes";

// Protected Routes
router.use("/genders", genderRoutes);
router.use("/professions", professionRoutes);
router.use("/swipes", auth, swipeRoutes);
router.use("/filter-prefs", auth, filterPrefsRoutes);
router.use("/call-logs", auth, callLogRoutes);
router.use("/timespans", auth, timespanRoutes);
router.use("/plans", auth, planRoutes);
router.use("/subscriptions", auth, subscriptionRoutes);

// Routes with embedded middleware
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
router.use("/posts", postRoutes);

export default router;
