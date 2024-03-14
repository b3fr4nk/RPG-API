import { Request, Response, NextFunction } from "express";
import Item from "../../models/Item";
import User from "../../models/Users";
//create
export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //add auth stuff

    const userId = (<any>req).user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(401)
        .json({ message: "you must be an admin user to do this." });
    }

    if (!user.isAdmin) {
      return res
        .status(401)
        .json({ message: "you must be an admin user to do this" });
    }

    const { name, type, health, attack, defense } = req.body;

    const foundItem = await Item.findOne({ name: name });

    if (foundItem) {
      return res.status(400).json({ message: "item already exists" });
    }

    const fields = { name, type, health, attack, defense };

    const item = new Item(fields);
    await item.save();

    return res.status(200).json({ success: "true", item: item.id });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
//read

export const getItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { itemId } = req.params;

    console.log(itemId);

    const item = await Item.findById(itemId);
    if (item) {
      return res.status(200).json({ item, message: `Item ${itemId} found` });
    }

    return res.status(400).json({ message: `Item ${itemId} not found` });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getAllItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const items = await Item.find();

    return res.status(200).json({ items });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
//update

export const updateById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { health, attack, defense } = req.body;

    const fields = { health, attack, defense };

    const userId = (<any>req).user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(401)
        .json({ message: "you must be an admin user to do this." });
    }

    if (!user.isAdmin) {
      return res
        .status(401)
        .json({ message: "you must be an admin user to do this" });
    }

    const item = await Item.findByIdAndUpdate(req.params.itemId, fields, {
      new: true,
      select: "-__v",
    });

    return res
      .status(200)
      .json({ message: `Item ${req.params.itemId} updated` });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//destroy

export const deleteById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (<any>req).user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(401)
        .json({ message: "you must be an admin user to do this." });
    }

    if (!user.isAdmin) {
      return res
        .status(401)
        .json({ message: "you must be an admin user to do this" });
    }

    await Item.findByIdAndDelete(req.params.itemId);

    return res
      .status(200)
      .json({ message: `Item ${req.params.itemId} was deleted` });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
