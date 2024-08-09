import jwt from "jsonwebtoken";

export default function authMiddleware(requiredRoles = []) {
  return (req, res, next) => {
    const { accessToken } = req.cookies;
    if (!accessToken) return res.sendStatus(401);

    jwt.verify(accessToken, process.env.ACCESS_SECRET_TOKEN, (err, payload) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: "Invalid token" });
      }

      req.tokenPayload = payload;

      const { userRole } = payload;
      if (!requiredRoles.includes(userRole)) {
        return res.sendStatus(403);
      }
      next();
    });
  };
}
