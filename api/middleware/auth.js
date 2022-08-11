import catchAsync from "../../utils/catchAsync";
import jwt from "jsonwebtoken";

const auth = catchAsync(async (req, res, next) => {
  if (req.headers["authorization"]) {
    try {
      let authorization = req.headers["authorization"].split(" ");
      if (authorization[0] !== "Bearer") {
        throw new Error("Bearer Missing in token");
      } else {
        req.jwt = jwt.verify(authorization[1], process.env.JWT_SECRET);
        return next();
      }
    } catch (err) {
      throw new Error("Invalid User");
    }
  } else {
    throw new Error("Token Not Found");
  }
});

export default auth;
