import jwt from "jsonwebtoken";
export default function authMiddleware(req, res, next) {
  const { accessToken } = req.cookies;

  if (!accessToken) return res.sendStatus(401);
  jwt.verify(accessToken, process.env.ACCESS_SECRET_TOKEN, (err, payload) => {
    if (err) {
      console.log(err);
      return res.status(400).json(err);
    }
    req.tokenPayload = payload;
    next();
  });
  return res.status(200);
}
