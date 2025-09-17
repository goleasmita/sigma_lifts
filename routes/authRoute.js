import express from "express";
import {
  createEnquiry,
  forgotController,
  getAllUsersController,
  listEnquiries,
  loginController,
  registerController,
  testController,
} from "../controllers/authController.js";
import { requireSignIn, isAdmin } from "./../middlewares/authMiddleware.js";

//route object
const router = express.Router();

//REGISTER POST
router.post("/register", registerController);

//LOGIN  POST
router.post("/login", loginController);

//forgot password
router.post("/forgot-password", forgotController);

//test route
router.get("/test", requireSignIn, isAdmin, testController);

//user get
router.get("/user-auth", requireSignIn, (req, res) => {
  res.send({
    ok: true,
  });
});

//admin get
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.send({
    ok: true,
  });
});

//all users get
router.get("/all-users", requireSignIn, isAdmin, getAllUsersController);

export default router;
