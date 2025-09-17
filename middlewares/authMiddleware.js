import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      console.log("❌ No token provided");
      return res
        .status(401)
        .send({ success: false, message: "No token provided" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    const decode = JWT.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", decode); // 👈 check who is inside
    req.user = decode;
    next();
  } catch (error) {
    console.log("❌ JWT verify failed:", error.message);
    return res
      .status(401)
      .send({ success: false, message: "Unauthorized access" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    console.log(
      "👤 Checking admin middleware for:",
      user?.email,
      "Role:",
      user?.role
    );

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    if (Number(user.role) !== 1) {
      console.log("❌ Blocked, role is:", user.role);
      return res.status(401).send({
        success: false,
        message: `Unauthorized - role is ${user.role}`,
      });
    }

    console.log("✅ Admin check passed for:", user.email);
    next();
  } catch (error) {
    console.log("❌ Admin check error:", error);
    res.status(500).send({ success: false, message: "Unauthorized access" });
  }
};
