import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import enquiryRoutes from "./routes/enquiryRoute.js";
import cors from "cors";
import sgMail from "@sendgrid/mail";

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

const allowedOrigins = [
  "http://localhost:5173", // Local frontend
  "https://sigma-lifts.onrender.com", // Deployed frontend (update if different)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "CORS policy does not allow access from this origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// app.options("/*", cors());

// -----------------
// Middlewares
// -----------------
app.use(express.json());
app.use(morgan("dev"));

// ✅ Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.get("/test-email", async (req, res) => {
  try {
    await sgMail.send({
      to: "goleasmita876@gmail.com",
      from: "goleasmita876@gmail.com",
      subject: "Test Email",
      text: "This is a test email from Render",
    });
    res.send("Email sent!");
  } catch (err) {
    console.error(err.response?.body || err.message);
    res.status(500).send("Email failed");
  }
});
// -----------------
// API Routes
// -----------------
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/enquiry", enquiryRoutes);

// Debug check
console.log("✅ Enquiry routes loaded at /api/v1/enquiry");

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
