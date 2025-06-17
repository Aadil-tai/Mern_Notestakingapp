const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
const singleUpload = require("./singleUpload");
const multipleUploadRoute = require('./multipleUploadRoute');
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");
const { notFound, errorHandler } = require("./Middlewares/errorMiddlewares");
const { protect } = require("./Middlewares/authMiddlewares");
const cloudinary = require("cloudinary").v2;

dotenv.config();
connectDB();

cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_Api,
    api_secret: process.env.Cloud_Secret,
});

const app = express();

// Middleware to parse JSON
app.use(express.json());

// CORS configuration
app.use(
    cors({
        origin: "http://localhost:5173", // Adjust if your frontend is hosted elsewhere
        credentials: true,
    })
);

// Static route for uploaded files
app.use("/uploads", express.static("uploads"));

// API routes
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/single", singleUpload);
app.use("/api/multiple", multipleUploadRoute);

// ------------ Deployment ------------
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, "../Frontend/dist")));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, "../Frontend", "dist", "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running successfully");
    });
}

// Error Handling Middlewares (MUST be at the end)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
