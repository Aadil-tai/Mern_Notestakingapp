const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const singleUpload = require("./singleUpload")
const multipleUploadRoute = require('./multipleUploadRoute');

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");

const { notFound, errorHandler } = require("./Middlewares/errorMiddlewares");
const notes = require("./Data/data");

const cloudinary = require("cloudinary").v2

dotenv.config();


cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_Api,
    api_secret: process.env.Cloud_Secret,
});
const app = express();

// Connect to database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// CORS configuration
app.use(
    cors({
        origin: "http://localhost:5173", // Frontend URL
        credentials: true,               // Allow cookies/auth headers
    })
);
app.use("/uploads", express.static("uploads"));

// Handle preflight requests
app.options("*", cors());

// Sample routes
// app.get("/api/notes", (req, res) => {
//     res.status(200).json(notes);
// });

// app.get("/api/notes/:id", (req, res) => {
//     const note = notes.find((n) => n._id === req.params.id);
//     if (note) {
//         res.json(note);
//     } else {
//         res.status(404).json({ message: "Note not found" });
//     }
// });

// Routes


app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes)

app.use('/api/single', singleUpload)
app.use('/api/multiple', multipleUploadRoute);

//to show a file on browser like 
//http://localhost:5000/uploads/1.png
app.use('/uploads', express.static("uploads"));

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);




// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
