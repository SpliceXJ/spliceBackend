import { User } from "../models_methods/userMethods.js";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

// New User Authentication
export const createNewUser = async (req, res) => {
  const user = await new User().createNewUser(
    req.body.firstname,
    req.body.lastname,
    req.body.username,
    req.body.email,
    req.body.password
  );
  if (user) {
    const token = await user.createJWT();
    return res.status(200).json({ token });
  }
  return res.status(400).json({ message: "account creation un-successful" });
};

// Sign in
export const signin = async (req, res) => {
  const user = new User(req.body.username);
  if (!(await user.doesExist()))
    return res.status(400).json({ message: "Invalid Credentials" });
  const token = await user.signIn(req.body.password);
  if (token) {
    return res.status(200).json({ token, message: "Login Successful" });
  } else {
    return res.status(400).json({ message: "Invalid Credentials" });
  };
};

// Email Verification
export const emailVerify = async (req, res) => {
  const user = await new User().emailVerify(req.body.email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  // Generate a JWT token that expires in 1 hour
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
  const resetUrl = `https://192.168.91.172:19000/ResetPasswordScreen/${token}`;
  const message = {
    from: process.env.SMTP_FROM_EMAIL,
    to: req.body.email,
    subject: "Password Reset Request",
    html: `Please click on this link to reset your password: <a href="${resetUrl}">${resetUrl}</a>`,
  };

  const transporter = await new User().transporter();
  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to send email" });
    }
    console.log(`Email sent: ${info.response}`);
    return res
      .status(200)
      .json({ message: "Password reset link sent to your email" });
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
