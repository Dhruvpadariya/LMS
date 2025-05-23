import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { authenticateUser } from "./middlewares/authMiddleware.js";
import paymentManagementController from "./controllers/paymentControler.js";


const app = express();

app.use(cors());
dotenv.config();
const PORT = process.env.PORT;
app.use(bodyParser.json());

const URL = process.env.MONGO_URI;

// Middleware
app.use(cookieParser());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Mongodb Connection success!");
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongodb disconnected!");
});

//routes
app.use('/api/paymentMangement', authenticateUser,paymentManagementController);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
