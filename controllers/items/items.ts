import { Request, Response, NextFunction } from "express";
import Item from "../../models/Item";
//create
export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //add auth stuff

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

    const oldItem = await Item.findById(req.params.itemId);

    const fields = { health, attack, defense };

    // add auth stuff

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
    //add auth stuff

    await Item.findByIdAndDelete(req.params.itemId);

    return res
      .status(200)
      .json({ message: `Item ${req.params.itemId} was deleted` });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
