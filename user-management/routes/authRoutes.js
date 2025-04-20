import express from "express";
import { register, login, getProfile } from "../controllers/authController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticateUser, (req, res) => {
  console.log("HIT /api/auth/profile");
  res.json({ message: "Profile hit", user: req.user });
});

router.get("/test", (req, res) => res.send("Auth route working"));

export default router;
