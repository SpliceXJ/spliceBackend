import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
dotenv.config();

export const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const hashedPassword = (password) => {
  return bcrypt.hash(password, 10);
};
export const createJWT = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET_KEY
  );
  return token;
};

export const protect = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.send("Not authorized");
    return;
  }

  const [, token] = bearer.split(" ");
  if (!token) {
    res.status(401);
    res.send("Not authorized");
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = payload;
    console.log(payload);
    next();
    return;
  } catch (e) {
    console.error(e);
    res.status(401);
    res.send("Not authorized");
    return;
  }
};
