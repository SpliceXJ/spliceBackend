const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const router = Router();

const prisma = new PrismaClient();
router.post("/", async (req, res) => {

  const { firstname, lastname, username, password, email } = req.body;
  const existingUser = await prisma.user.findUnique({
    where: { username: username },
  });

  if (existingUser) {
    return res.status(409).send({ message: "Username already exists" });
  }
  const newUser = await prisma.user.create({
    data: {
      firstname: firstname,
      lastname: lastname,
      username: username,
      email: email,
      password: password,
    },
  });

  const createdUsers = [newUser];
  return res.status(201).send({ message: "User created", user: createdUsers });

});

module.exports = router;
