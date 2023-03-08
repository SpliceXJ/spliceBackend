import express from "express";
import { protect } from "./src/middlewares/auth.js";
import {
  createNewUser,
  forgotPassword,
  signin,
} from "./src/handlers/users.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3002;

app.post("/api/v1/signup", createNewUser);
app.post("/api/v1/signin", signin);
app.post("/api/v1/forgotPassword", forgotPassword);

app.use(protect); // generating request user & token auth

app.listen(PORT, () => {
  console.log(`SERVER RUNNING AT PORT ${PORT}`);
});
