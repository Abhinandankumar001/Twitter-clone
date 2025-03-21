import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Connect to database
databaseConnection();

const app = express();

// Define __dirname in ES module scope
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
const prodOrigins = [process.env.ORIGIN_1];
const devOrigin = ['http://localhost:5173'];

const allowedOrigins = process.env.NODE_ENV === 'production' ? prodOrigins : devOrigin;

app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin)) {
            console.log(origin, allowedOrigins);
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));


// Debugging CORS issue
console.log("Allowed Origins:", allowedOrigins);

// Root route to check server status
app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);

// Serve static frontend (optional, uncomment if needed)
// app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// });

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
