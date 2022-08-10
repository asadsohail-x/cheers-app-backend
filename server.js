import mongoose from "mongoose";
import { config } from "dotenv";
config({
  path: "./config.env",
});

// // process.on("uncaughtException", (err) => {
// //   console.log("UNCAUGHT EXCEPTION!!! shutting down...");
// //   console.log(err.name, err.message);
// //   process.exit(1);
// // });

import app from "./app.js";

const database = process.env.DATABASE;

// Connect the database
mongoose
  .connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    const PORT = process.env.PORT || 5000;
    console.log("\n> DB connection successful!");
    app.listen(PORT, () => {
      console.log(`> Server listening on port: ${PORT}`);
    });

    process.on("unhandledRejection", (err) => {
      console.log("UNHANDLED REJECTION!!!  shutting down ..");
      console.log("====>", err);
      console.log(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });
  });
