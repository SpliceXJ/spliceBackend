import { json } from "express";
import prisma from "../db.js";
import { comparePassword, createJWT, hashedPassword } from "../modules/auth.js";

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
