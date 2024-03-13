import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../../models/Users";

// Find specific user by id
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let user = await User.findById(req.params.id).select("username");

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let user = await User.findById((<any>req).user?.id).select("username");

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.body;

    const fields = {
      username,
    };

    // Check if username or email is already taken
    const foundUser = await User.findOne({
      $or: [{ username }],
    });

    if (foundUser) {
      const message = "username is already taken";
      return res.status(400).json({ message });
    }

    const selectFields = Object.keys(fields).join(" ");

    const user = await User.findByIdAndUpdate((<any>req).user?.id, fields, {
      new: true,
      select: selectFields,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const deleteUserAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await User.findByIdAndDelete((<any>req).user?.id);

    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (err) {
    res.status(500).json({ message: err });
    next(err);
  }
};
