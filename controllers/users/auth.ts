import { Request, Response, NextFunction } from "express";
import User from "../../models/Users";

// Handles the registration of a new user
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    const fields = {
      username,
      password,
    };

    // Check if username is already taken
    const foundUser = await User.findOne({
      $or: [{ username }],
    });

    if (foundUser) {
      const message = "Username is already taken";
      return res.status(400).json({ message });
    }

    const user = new User(fields);
    const token = await user.schema.methods.getSignedJwtToken(user._id);
    await user.save();

    res
      .status(201)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        success: true,
        message: "User created!",
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Handles the login of a user
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create token
    const token = await user.schema.methods.getSignedJwtToken(user._id);

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        success: true,
        message: "User logged in!",
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Handles the logout of a user
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(200)
      .cookie("access_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0),
      })
      .json({
        success: true,
        message: "User logged out!",
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
