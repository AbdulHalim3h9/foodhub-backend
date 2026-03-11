import { prisma } from "../../lib/prisma";
import type { ILoginUser, IRegisterUser } from "./auth.interface";
import bcrypt from "bcryptjs";
import { jwtHelpers } from "../../helpers/jwtHelpers";

const register = async (payload: IRegisterUser) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (isUserExists) {
    throw new Error("User with this email already exists!");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const result = await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: payload.role || "CUSTOMER",
    },
  });

  const { password, ...userWithoutPassword } = result;

  const accessToken = jwtHelpers.createToken(
    {
      id: result.id,
      email: result.email,
      role: result.role,
    },
    (process.env.JWT_ACCESS_SECRET as string) || "secret",
    (process.env.JWT_ACCESS_EXPIRES_IN as string) || "1d",
  );

  const refreshToken = jwtHelpers.createToken(
    {
      id: result.id,
      email: result.email,
      role: result.role,
    },
    (process.env.JWT_REFRESH_SECRET as string) || "secret_refresh",
    (process.env.JWT_REFRESH_EXPIRES_IN as string) || "30d",
  );

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

const login = async (payload: ILoginUser) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userData) {
    throw new Error("User not found!");
  }

  if (userData.status !== "ACTIVE") {
    throw new Error("User is not active!");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    userData.password,
  );

  if (!isPasswordMatched) {
    throw new Error("Password incorrect!");
  }

  const accessToken = jwtHelpers.createToken(
    {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    },
    (process.env.JWT_ACCESS_SECRET as string) || "secret",
    (process.env.JWT_ACCESS_EXPIRES_IN as string) || "1d",
  );

  const refreshToken = jwtHelpers.createToken(
    {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    },
    (process.env.JWT_REFRESH_SECRET as string) || "secret_refresh",
    (process.env.JWT_REFRESH_EXPIRES_IN as string) || "30d",
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const authService = {
  register,
  login,
};
