const express = require("express");
const router = express.Router();

//Required api's

// const User = require("./Routes/User");
const genderRoutes = require("./routes/gender.routes");
const professionRoutes = require("./routes/profession.routes");
const timespanTypeRoutes = require("./routes/timespanType.routes");
const planRoutes = require("./routes/plan.routes");
const userRoutes = require("./routes/user.routes");
const swipeRoutes = require("./routes/swipe.routes");
// const Categories = require("./Routes/Categories");
// const Item = require("./Routes/Item");
// const Order = require("./Routes/Order");
// const Payment = require("./Routes/Payment");
// const ImageUpload = require("./Routes/ImageUpload");

/*********Main Api**********/
// router.use("/user", User);
router.use("/genders", genderRoutes);
router.use("/professions", professionRoutes);
router.use("/timespan-types", timespanTypeRoutes);
router.use("/plans", planRoutes);
router.use("/users", userRoutes);
router.use("/swipes", swipeRoutes)
// router.use("/Categories", Categories);
// router.use("/Item", Item);
// router.use("/Order", Order);
// router.use("/Payment", Payment);
// router.use("/Upload", ImageUpload);

module.exports = router;
