import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import enquiryRoutes from "./routes/enquiryRoute.js";
import cors from "cors";

// -----------------
// Config environment
// -----------------
dotenv.config();

// -----------------
// Connect to database
// -----------------
connectDB();

// -----------------
// Create express app
// -----------------
const app = express();

// -----------------
// CORS Setup
// -----------------
const allowedOrigins = ["http://localhost:5173"]; // local frontend only

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// -----------------
// Middlewares
// -----------------
app.use(express.json());
app.use(morgan("dev"));

// -----------------
// API Routes
// -----------------
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/enquiry", enquiryRoutes);

// -----------------
// Test route
// -----------------
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working" });
});

// -----------------
// Development root route (only in non-production)
// -----------------
if (process.env.NODE_ENV !== "production") {
  app.get("/", (req, res) =>
    res.send("<h1>API is running in development...</h1>")
  );
}

// -----------------
// Start server
// -----------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(colors.bgCyan.white(`🚀 Server is running on port ${PORT}`));
});
