import express from "express";
import session from "express-session";
import signupRouter from "./src/routes/auth/signup.js";
import signedOutRouter from "./src/routes/auth/signout.js";
import signedInRouter from "./src/routes/auth/signIn.js";
import { protect } from "./src/modules/auth.js";
import { createNewUser, signin } from "./src/handlers/users.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "asguard",
    resave: false,
    saveUninitialized: false,
  })
);
const PORT = 3002;
app.post("/api/v1/signup", createNewUser);
app.post("/api/v1/signin", signin);

app.listen(PORT, () => {
  console.log(`SERVER RUNNING AT PORT ${PORT}`);
});
