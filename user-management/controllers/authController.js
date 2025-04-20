import { registerUser, loginUser } from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = await registerUser({ firstName, lastName, email, password, role });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Failed to register user", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({ message: "Invalid username or password" });
  }
};

export const getProfile = (req, res) => {
  res.status(200).json({
    user: req.user,
    message: "Profile fetched successfully",
  });
};
