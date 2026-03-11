import jwt, { Secret, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string,
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime,
  } as SignOptions);
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret);
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
