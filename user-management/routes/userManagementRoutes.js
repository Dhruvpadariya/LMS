import express from "express";
import { getAllUsers } from "../controllers/userManagementController.js";

const router = express.Router();

// Example route
router.get("/users", getAllUsers);

export default router;
