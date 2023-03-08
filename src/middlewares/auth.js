export const protect = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    return res.sendStatus(401);
  }

  const [, token] = bearer.split(" ");
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = payload;
    next();
    return;
  } catch (e) {
    console.error(e);
    return res.sendStatus(401);
  }
};
