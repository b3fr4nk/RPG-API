import { Request, Response, NextFunction } from "express";
import Item from "../../models/Item";
import Character from "../../models/Character";
import { ObjectId } from "mongoose";
import Quest from "../../models/Quest";

// create quest
export const createQuest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, objectives, itemsGranted, xpGranted } = req.body;

    const user = (<any>req).user.id;

    // add admin stuff

    const findQuest = await Quest.findOne({ name: name });

    if (findQuest) {
      return res.status(400).json({
        message: `quest named ${name} already exists create a new one`,
      });
    }

    const fields = { name, objectives, itemsGranted, xpGranted };

    const quest = await Quest.create(fields);
    quest.save();

    return res.status(200).json({ message: "quest created", success: "true" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Read quest
export const getAllQuests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const quests = await Quest.find();

    return res.status(200).json({ quests });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getQuestById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { questId } = req.params;

    const quest = await Quest.findById(questId);

    if (!quest) {
      return res.status(400).json({ message: `Quest ${questId} not found.` });
    }

    return res.status(200).json({ quest });
  } catch (err) {}
};

// update quest
export const updateQuest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { questId } = req.params;
    const { name, objectives } = req.body;

    const fields = { name, objectives };

    const user = (<any>req).user.id;

    const questFound = await Quest.findById(questId);

    if (!questFound) {
      return res.status(200).json({ message: `quest ${questId} not found.` });
    }

    const quest = await Quest.findByIdAndUpdate(questId, fields, {
      new: true,
      select: "-__v",
    });

    return res
      .status(200)
      .json({ message: `Quest ${questId} successfully updated.` });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//delete quest
export const deleteQuest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { questId } = req.params;

    const user = (<any>req).user.id;

    await Quest.findByIdAndDelete(questId);

    return res
      .status(200)
      .json({ message: `Quest ${questId} successfully deleted.` });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
