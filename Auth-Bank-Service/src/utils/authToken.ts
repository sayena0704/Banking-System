

import jwt, { Secret } from "jsonwebtoken";
import { config } from "../config/config";


const accessSecret: Secret = config.jwt.accessSecret;
const refreshSecret: Secret = config.jwt.refreshSecret;


export const generateTokens = (user: { id: string; email: string; role: "USER" | "ADMIN"; }) => {
  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      type: "access",
    },
    accessSecret,
    { expiresIn: config.jwt.accessExpiry }
  );


  const refreshToken = jwt.sign(
    {
      userId: user.id,
      type: "refresh",
    },
    refreshSecret,
    { expiresIn: config.jwt.refreshExpiry }
  );


  return { accessToken, refreshToken };
};
