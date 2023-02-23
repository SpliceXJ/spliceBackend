const express = require("express");
const session = require("express-session");
const signupRouter = require("./routes/auth/signup");
const signinRouter = require("./routes/auth/signIn");
const signedOutRouter = require("./routes/auth/signout");

const app = express();
app.use(express.json());
app.use(
  session({
    secret: "asguard",
    resave: false,
    saveUninitialized: false,
  })
);
const PORT = 3002;

app.use("/api/v1/signup", signupRouter);
app.use("/api/v1/signin", signinRouter);
app.use("/api/v1/signout", signedOutRouter)

app.listen(PORT, () => {
  console.log(`SERVER RUNNING AT PORT ${PORT}`);
});
