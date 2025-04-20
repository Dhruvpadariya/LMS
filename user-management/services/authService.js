import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendEmail } from "./emailService.js";

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  console.error("JWT_SECRET is not defined in the environment variables.");
  process.exit(1);
}

const registerUser = async (userData) => {
  try {
    const { firstName, lastName, email, password, role } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const savedUser = await newUser.save();

    // Send registration email (non-blocking)
    const subject = "Registration Successful";
    const text = `Welcome ${firstName}, you have successfully registered!`;
    const html = `
      <html>
        <head><title>Registration Successful</title></head>
        <body>
          <h3>Welcome ${firstName} ${lastName} to EduPulse!</h3>
          <p>Your registration was successful.</p>
        </body>
      </html>
    `;

    sendEmail(email, subject, text, html).catch(err => {
      console.error("Failed to send registration email:", err.message);
    });

    const { password: _, ...userWithoutPassword } = savedUser.toObject();

    return {
      user: userWithoutPassword,
      message: "User registered successfully!",
    };
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    throw error;
  }
};

const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid username or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid username or password");
    }

    const subject = "Login Successful";
    const text = `Welcome ${user.firstName} ${user.lastName}, you have successfully logged in.`;
    const html = `
      <html>
        <head><title>Login Successful</title></head>
        <body>
          <h1>Welcome ${user.firstName} to EduPulse!</h1>
          <p>Your login was successful.</p>
        </body>
      </html>
    `;

    sendEmail(email, subject, text, html).catch(err => {
      console.error("Failed to send login email:", err.message);
    });

    const token = jwt.sign(
      {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: "1d" }
    );

    return token;
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    throw new Error("Failed to login");
  }
};

export { registerUser, loginUser };
