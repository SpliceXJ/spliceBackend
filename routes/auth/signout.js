const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const router = Router();

const prisma = new PrismaClient();
router.post("/", (req, res) => {
  if (req.session.user) {
    req.session.destroy(() => {
      res.send("Signed out successfully");
    });
  } else {
    res.status(401).send("User is not signed in");
  }
});
module.exports = router