import type { Request, Response } from "express";
import { authService } from "./auth.service";

const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);
    const { refreshToken, accessToken, user } = result;

    res.cookie("refreshToken", refreshToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "User registered successfully!",
      data: {
        accessToken,
        user,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);

    const { refreshToken, accessToken } = result;

    res.cookie("refreshToken", refreshToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      data: {
        accessToken,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

export const authController = {
  register,
  login,
};
