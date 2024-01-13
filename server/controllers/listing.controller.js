import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (listing) {
      if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, "You can only delete yourn own listing"));
      } else {
        await Listing.findByIdAndDelete(req.params.id);
        return res
          .status(200)
          .json({ message: "Listing deleted successfully" });
      }
    } else {
      return next(errorHandler(404, "Listing not found"));
    }
  } catch (error) {
    next(error);
  }
};
