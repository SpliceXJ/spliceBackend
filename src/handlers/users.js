import { json } from "express";
import prisma from "../db.js";
import { comparePassword, createJWT, hashedPassword } from "../modules/auth.js";

// New User Authentication
export const createNewUser = async (req, res) => {
  const user = await prisma.user.create({
    data: {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
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
  const isValid = await comparePassword(req.body.password, user.password);

  if (!isValid) {
    req.status(401);
    res.send({ message: "wrong password" });
  }
  const token = createJWT(user);
  res.json({ token });
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });
  if (!user) {
    return res.status(400).json({ message: "Invalid username" });
  }

  // Check if new password matches confirm password
  if (req.body.newPassword !== req.body.confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }
  const updatedUser = await prisma.user.update({
    where: { username: req.body.username },
    data: { password: await hashedPassword(req.body.newPassword) },
  });
  // Update user's password

  const token = createJWT(updatedUser);
  res.json({ token });
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
