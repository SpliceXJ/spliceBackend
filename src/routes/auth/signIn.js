import { PrismaClient } from "@prisma/client";
import Router from "express";
const router = Router();

const prisma = new PrismaClient();
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  if (req.session.user) {
    req.session.destroy();
  }
  const user = await prisma.user.findUnique({
    where: { username: username },
  });
  const passwordMatch = user.password === password;
  if (!user || !passwordMatch) {
    res.status(401).send("Invalid username or password");
    return;
  }
  req.session.user = user;
  res.json({ message: "Authentication successful" });
});

export default router;
