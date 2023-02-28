import { PrismaClient } from '@prisma/client'
import jwt from "jsonwebtoken";
import prisma from "../db.js";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
dotenv.config();

export class User {
    // username eventually changes to ID at some point yah
  constructor(username = null) {
    this.prismaUser = prisma.user.findUnique({
        where: {
          username: username,
        },
      });
  };

  async doesExist () {
    let exists = false;
    if (this.prismaUser) exists = true;
    return exists;
  };

  async comparePassword (password) {
    return await bcrypt.compare(password, this.prismaUser.password);
  };

  async signIn (password) {
    if (!await this.comparePassword(password)) return null;
    return await this.createJWT();
  };

  async createJWT (expiresIn="365d") {
    const token = jwt.sign(
      {
        id: this.prismaUser.id,
        username: this.prismaUser.username,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn }
    );
    return token;
  };

  async createNewUser ({firstname, lastname, username, email, password}) {
    try {
        const user = await prisma.user.create({
            data: {
              firstname: firstname,
              lastname: lastname,
              username: username,
              email: email,
              password: await bcrypt.hash(password, 5),
            },
          });
        this.prismaUser = user;
        return user;
    } catch (err) {
        console.log(err);
        return null;
    }
  };
}
