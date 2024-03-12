import { Request, Response, NextFunction } from "express";
import Item from "../../models/Item";
import Character from "../../models/Character";

//create
export const createCharacter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, health, attack, defense, xp } = req.body;

    const findCharacter = await Character.findOne({ name: name });

    if (findCharacter) {
      return res.status(400).json({
        message: `Character with name ${name} already exists. Please choose a different name.`,
      });
    }

    const fields = { name, health, attack, defense, xp };

    const character = await new Character(fields);
    await character.save();

    return res
      .status(200)
      .json({ message: `Character ${character.id} created`, success: "true" });

    // Add character ownership here
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//read
export const getCharacterById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { characterId } = req.params;

    const character = await Character.findById(characterId);

    return res
      .status(200)
      .json({ character, message: `Character ${characterId} found` });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//update

//destroy

//add quest

//add item

//quest complete
