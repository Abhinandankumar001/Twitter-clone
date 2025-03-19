import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import cors from "cors";
import path from "path";

dotenv.config({
    path:".env"
})
databaseConnection();
const app = express(); 
const __dirname = path.resolve();

// middlewares
app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());
app.use(cookieParser());

// cors

app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
  

// Add a route to show backend status
app.get("/status", (req, res) => {
    res.send("Backend is running");
});


// api
app.use("/api/v1/user",userRoute);
app.use("/api/v1/tweet", tweetRoute);
 
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

app.listen(process.env.PORT || 3001, () => {
    console.log(`Server is running on port ${process.env.PORT || 3001}`);
});
