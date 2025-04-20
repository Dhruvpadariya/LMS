// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import userManagementRoutes from "./routes/userManagementRoutes.js";
import { authenticateUser } from "./middlewares/authMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

// DB connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => console.log("Mongodb Connection success!"));
mongoose.connection.on("disconnected", () => console.log("Mongodb disconnected!"));

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/userManagement", authenticateUser, userManagementRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found", url: req.originalUrl });
});
