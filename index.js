const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const { userProtected, adminProtected } = require("./middlewares/protected");
const asyncHandler = require('express-async-handler'); // Ensure this is installed
const jwt = require('jsonwebtoken'); // Ensure this is installed
require("dotenv").config({ path: "./.env" });

// Initialize Express App
const app = express();

// Database Connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB Connected");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

// Define Allowed Origins
const allowedOrigins = process.env.NODE_ENV === "development"
    ? ["http://localhost:5173", "http://localhost:5174"] // Add more if needed
    : ["https://link-short-2t2i.onrender.com"];

// CORS Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // Allows cookies to be sent
}));

// Middleware Order
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/v1/auth", require("./routes/authRoute"));
app.use("/api/v1/url", require("./routes/urlRoutes"));
app.use("/api/v1/user", userProtected, require("./routes/userRoutes"));
app.use("/api/v1/admin", adminProtected, require("./routes/adminRoutes"));

// Consolidated Wildcard Route
app.use("*", (req, res) => {
    if (req.originalUrl.startsWith('/api/')) {
        res.status(404).json({ message: "API Resource not found" });
    } else {
        res.sendFile(path.join(__dirname, "dist", "index.html"), (err) => {
            if (err) {
                res.status(500).send({ message: "Server Error" });
            }
        });
    }
});

// Error Handler Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || "Something went wrong" });
});

// Start Server After DB Connection
const PORT = process.env.PORT || 5000;
mongoose.connection.once("open", () => {
    app.listen(PORT, () => {
        console.log(`Server running: http://localhost:${PORT}`);
    });
});
