// routes/enquiryRoute.js
import express from "express";
// import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createEnquiry,
  deleteEnquiry,
  listEnquiries,
} from "../controllers/enquiryController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User submits enquiry
router.post("/", createEnquiry);

// Admin fetches all enquiries
// router.get("/enquiry-list", requireSignIn, isAdmin, listEnquiries);
router.get("/enquiry-list", requireSignIn, isAdmin, listEnquiries);

// DELETE enquiry
router.delete("/:id", requireSignIn, isAdmin, deleteEnquiry);

export default router;
