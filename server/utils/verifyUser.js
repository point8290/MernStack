import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";
export const verifyUser = (req, res, next) => {
  const token = req.cookies["access-token"];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return next(errorHandler(403, "Invalid Token"));
      }
      req.user = decoded;
      return next();
    });
  } else {
    return next(errorHandler(401, "Unauthorized request"));
  }
};
