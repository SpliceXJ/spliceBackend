import { PrismaClient } from "@prisma/client";
import Router from "express";
import bcrypt from "bcrypt";

const router = Router();

class Signup {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async createUser(firstName, lastName, username, email, password) {
    // const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, 5);

    await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
      },
    });
  }
}

const signup = new Signup();

router.post("/", async (req, res) => {
  const { firstName, lastName, username, password } = req.body;

  try {
    await signup.createUser(firstName, lastName, username, password);
    res.status(201).send("User created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user");
  }
});

export default router;
