import prisma from "../db.js";
import { comparePassword, createJWT, hashedPassword } from "../modules/auth.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

// New User Authentication
export const createNewUser = async (req, res) => {
  const user = await prisma.user.create({
    data: {
      firstname: req.body.firstname,
      username: req.body.username,
      email: req.body.email,
      password: await hashedPassword(req.body.password),
    },
  });
  const token = createJWT(user);
  res.json({ token });
};

// Sign in
export const signin = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password." });
  }
  const isValid = await comparePassword(req.body.password, user.password);

  if (!isValid) {
    res.status(401);
  }
  const token = createJWT(user);
  res.json({ token });
};

// Email Verification
export const emailVerify = async (req, res) => {
  const { email } = req.body;

  // Check if the user exists in your database
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate a JWT token that expires in 1 hour
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  // Send an email to the user with a link to reset their password
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const resetUrl = `https://192.168.91.172:19000/ResetPasswordScreen/${token}`;
  const message = {
    from: process.env.SMTP_FROM_EMAIL,
    to: email,
    subject: "Password Reset Request",
    html: `Please click on this link to reset your password: <a href="${resetUrl}">${resetUrl}</a>`,
  };
  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to send email" });
    }
    console.log(`Email sent: ${info.response}`);
    return res.json({ message: "Password reset link sent to your email" });
  });
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  // Verify the JWT token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Check if the new password matches the confirm password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Update the user's password in your database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: await hashedPassword(newPassword) },
    });

    // Return a JWT token to authenticate the user after password reset
    const newToken = createJWT(updatedUser);
    return res.json({ token: newToken });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Sign out
export const signout = async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  // Verify the token
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }

  // Get the user ID from the token payload
  const payload = jwt.decode(token);
  const userId = payload.sub;

  // Update the user's token version to invalidate the current token
  const user = await prisma.user.update({
    where: { id: userId },
    data: { tokenVersion: { increment: 1 } },
  });

  return res.status(200).json({ message: "Sign out successful" });
};
