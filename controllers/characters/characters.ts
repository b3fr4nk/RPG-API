import { Request, Response, NextFunction } from "express";
import Item from "../../models/Item";
import Character from "../../models/Character";
import { ObjectId } from "mongoose";

// Removes item from current location
const dropItem = async (ids: ObjectId[], toRemove: ObjectId[]) => {
  var items: ObjectId[];
  items = [];
  ids.filter((player) => {
    if (toRemove.includes(player)) {
      items.push(player);
    }
  });
  return items;
};

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

export const getAllCharacters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const characters = await Character.find();

    return res.status(200).json({ characters });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//update

export const updateCharacterName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { characterId } = req.params;
    const { name } = req.body;

    const fields = { name };

    await Character.findByIdAndUpdate(characterId, fields, {
      new: true,
      select: "-__v",
    });

    return res.status(200).json({
      message: `Character ${characterId}'s name successfully updated.`,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//add item to inventory
export const addItemToInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { characterId } = req.params;
    const { itemIds } = req.body;

    const character = await Character.findById(characterId);

    if (!character) {
      return res.status(400).json({ message: "Character not found" });
    }

    const itemsNotFound: Array<ObjectId> = [];
    const itemsFound: Array<ObjectId> = [];

    for (let i = 0; i < itemIds.length; i++) {
      const itemFound = await Item.findById(itemIds[i]);

      if (!itemFound) {
        itemsNotFound.push(itemIds[i]);
      } else {
        itemsFound.push(itemIds[i]);
      }
    }

    character?.inventory.push(...itemsFound); //"..." is the spread operator it allows an array to be expanded in place
    await character?.save();

    return res.status(200).json({
      message: `Character ${characterId} now has ${itemsFound}.`,
      itemsAdded: itemsFound,
      itemsNotAdded: itemsNotFound,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//remove item from inventory
export const removeItemFromInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { characterId } = req.params;
    const toRemove: ObjectId[] = req.body.itemIds;

    const character = await Character.findById(characterId);

    if (!character) {
      return res
        .status(400)
        .json({ message: `Character ${characterId} not found` });
    }
    for (let i = 0; i < toRemove.length; i++) {
      if (!character.inventory.includes(toRemove[i])) {
        return res
          .status(400)
          .json({ message: `Item ${toRemove[i]} not found in inventory.` });
      }
    }

    const newInventory = await dropItem(character.inventory, toRemove);
    character.inventory = newInventory;

    character.save();

    return res.status(200).json({
      message: `Character successfully equipped items!`,
      equipment: toRemove,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// equip item
export const equipItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { characterId } = req.params;
    const equipping: ObjectId[] = req.body.itemIds;

    const character = await Character.findById(characterId);

    if (!character) {
      return res
        .status(400)
        .json({ message: `Character ${characterId} not found.` });
    }

    for (let i = 0; i < equipping.length; i++) {
      if (!character.inventory.includes(equipping[i])) {
        return res.status(400).json({
          message: `Cannot equip item ${equipping[i]}. Item does not exist in player inventory.`,
        });
      }
      // add checks to make sure only one item of each type is equipped
    }

    const newInventory = await dropItem(character.inventory, equipping);
    character.equipment = character.equipment.concat(equipping);
    character.inventory = newInventory;
    await character.save();

    return res.status(200).json({
      message: `Character successfully equipped items!`,
      equipment: equipping,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const unequipItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { characterId } = req.params;
    const removing: ObjectId[] = req.body.itemIds;

    const character = await Character.findById(characterId);

    if (!character) {
      return res.status(400).json({ message: "Error Character not found" });
    }

    for (let i = 0; i < removing.length; i++) {
      if (!character.equipment.includes(removing[i])) {
        return res.status(400).json({
          message: `Cannot unequip ${removing[i]}. Item not equipped`,
        });
      }
    }

    const newEquipment = await dropItem(character.inventory, removing);
    character.inventory = character.inventory.concat(removing);
    character.equipment = newEquipment;

    character.save();

    return res
      .status(200)
      .json({ message: `Items successfully unequiped`, items: removing });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// add quest

//quest complete

//destroy
export const deleteCharacter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { characterId } = req.params;

    await Character.findByIdAndDelete(characterId);

    return res
      .status(200)
      .json({ message: `Character ${characterId} successfully deleted` });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
