import express from "express";
import session from "express-session";
import { protect } from "./src/middlewares/auth.js";
import {
  createNewUser,
  forgotPassword,
  signin,
  signout,
} from "./src/handlers/users.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(
//   session({
//     secret: "asguard",
//     resave: false,
//     saveUninitialized: false,
//   })
// );
app.use(protect); // generating request user & token auth
const PORT = 3002;
app.post("/api/v1/signup", createNewUser);
app.post("/api/v1/signin", signin);
app.post("/api/v1/forgotPassword", forgotPassword);
app.post("/api/v1/signout", signout);

app.listen(PORT, () => {
  console.log(`SERVER RUNNING AT PORT ${PORT}`);
});
