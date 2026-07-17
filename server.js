require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./src/config/db");
const { notFound, errorHandler } = require("./src/middleware/errorHandler");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const menuRoutes = require("./src/routes/menuRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");

// Connect to MongoDB Atlas
connectDB();

const app = express();

// --- Global middleware ---
app.use(helmet()); // secure HTTP headers
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")); // request logging
app.use(express.json()); // parse JSON request bodies

// CORS: allow only the configured frontend origin(s)
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

console.log("CLIENT_ORIGIN:", process.env.CLIENT_ORIGIN);
console.log("allowedOrigins:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (e.g. Postman, curl, mobile apps)
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// --- Health check ---
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "The Online Eatery API is running",
  });
});

// --- API routes ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);

// --- 404 + centralized error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
