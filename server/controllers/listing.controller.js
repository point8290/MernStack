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
export const edit = async (req, res, next) => {
  const id = req.params.id;
  try {
    const listing = await Listing.findById(id);
    if (listing) {
      if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, "You can only edit your own listing"));
      } else {
        const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        return res.status(200).json(updatedListing);
      }
    } else {
      return next(errorHandler(404, "Listing not found"));
    }
  } catch (error) {
    next(error);
  }
};
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (listing) {
      if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, "You can only delete your own listing"));
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
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (listing) {
      return res.status(200).json(listing);
    } else {
      return next(errorHandler(404, "Listing not found"));
    }
  } catch (error) {
    next(error);
  }
};
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const offer = req.query.offer;
    const furnished = req.query.furnished;
    const parking = req.query.parking;
    const type = req.query.type;
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    if (offer == undefined || offer == false) {
      offer = { $in: [true, false] };
    }
    if (furnished == undefined || furnished == false) {
      furnished = { $in: [true, false] };
    }
    if (parking == undefined || parking == false) {
      parking = { $in: [true, false] };
    }
    if (type == undefined || type == "all") {
      type = { $in: ["sale", "rent"] };
    }
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    if (listings) {
      return res.status(200).json(listings);
    } else {
      return next(errorHandler(404, "Listings not found"));
    }
  } catch (error) {
    next(error);
  }
};
