import jwt from 'jsonwebtoken';
import 'dotenv/config'

const SECRET_KEY = process.env.SECRET_KEY;

export function createToken(payload, options = { expiresIn: "1d" }) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET_KEY, options, (err, token) => {
      if (err) reject({ message: "Token creation failed" });
      resolve(token);
    })
  })
}

export function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, data) => {
      if (err) reject({ message: "Invalid token" })
      resolve(data);
    })
  })

}