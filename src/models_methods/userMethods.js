import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import prisma from "../db.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

export class User {
  // username eventually changes to ID at some point yah
  constructor(username = null) {
    this.username = username;
    this.prismaUser = "";
  }

  async fetchUser() {
    this.prismaUser = await prisma.user.findUnique({
      where: {
        username: this.username,
      },
    });
    return this.prismaUser;
  }

  // always call this function..... always
  async doesExist() {
    let exists = false;
    if (await this.fetchUser()) exists = true;
    return exists;
  }

  async comparePassword(password) {
    console.log(this.prismaUser, password);
    return await bcrypt.compare(password, this.prismaUser.password);
  }

  async signIn(password) {
    if (!(await this.comparePassword(password))) return null;
    return await this.createJWT();
  }

  async createJWT(expiresIn = "365d") {
    const token = jwt.sign(
      {
        id: this.prismaUser.id,
        username: this.prismaUser.username,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn }
    );
    return token;
  }

  async createNewUser(firstname, lastname, username, email, password) {
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
      return this;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async emailVerify(email) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async transporter() {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    return transporter;
  }

  async sendEmail(mailOptions) {
    const transporter = await this.transporter();
    return await transporter.sendMail(mailOptions);
  }
}
