const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const router = Router();

const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { username, newPassword, confirmPassword } = req.body;

  // Check if user with given username exists
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return res.status(400).json({ message: "Invalid username" });
  }

  // Check if new password matches confirm password
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Update user's password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  const updatedUser = await prisma.user.update({
    where: { id: id },
    data: { password: hashedPassword },
  });

  return res.json(updatedUser);
});

module.exports = router;
