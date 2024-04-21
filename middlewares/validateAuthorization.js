import { verifyToken } from '../services/jwt.js';

export async function validateAuthorization(req, res, next) {
  const { credentials } = req.cookies;
  if (!credentials) return res.status(401).send({ error: "No token, authorization denied" })

  try {
    const data = await verifyToken(credentials);
    req.body.idToken = data.id;
    next();
  }
  catch (err) {
    console.log(err.message);
    return res.status(403).send({ error: err.message });
  }

}