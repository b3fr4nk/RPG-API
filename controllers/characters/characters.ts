import { Request, Response, NextFunction } from "express";
import Item from "../../models/Item";
import Character from "../../models/Character";
import Quest from "../../models/Quest";
import { ObjectId, Query } from "mongoose";

// Removes item from current location
const removeFromList = async (ids: ObjectId[], toRemove: ObjectId[]) => {
  var items: ObjectId[];
  items = [];
  ids.filter((player) => {
    if (toRemove.includes(player)) {
      items.push(player);
    }
  });
  return items;
};

const isOwner = async (characterId: string, ownerId: string) => {
  const isOwner = await Character.findOne({
    _id: characterId,
    owner: ownerId,
  });

  if (!isOwner) {
    return false;
  }

  return true;
};

//create
export const createCharacter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, health, attack, defense, xp } = req.body;
    const owner = (<any>req).user.id;

    const findCharacter = await Character.findOne({ name: name });

    if (findCharacter) {
      return res.status(400).json({
        message: `Character with name ${name} already exists. Please choose a different name.`,
      });
    }

    const fields = { name, health, attack, defense, xp, owner };

    const character = await new Character(fields);
    await character.save();

    return res
      .status(200)
      .json({ message: `Character ${character.id} created`, success: "true" });
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

    const owner = (<any>req).user.id;

    const isOwner = await Character.findOne({
      _id: req.params.characterId,
      owner: owner,
    });

    if (!isOwner) {
      return res
        .status(401)
        .json({ message: `You are not the owner of this character.` });
    }

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

    const owner = (<any>req).user.id;

    const character = await Character.findById(characterId);

    if (!character) {
      return res.status(400).json({ message: "Character not found" });
    }

    const isOwner = await Character.findOne({
      _id: req.params.characterId,
      owner: owner,
    });

    if (!isOwner) {
      return res
        .status(401)
        .json({ message: `You are not the owner of this character.` });
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

    const owner = (<any>req).user.id;

    const character = await Character.findById(characterId);

    if (!character) {
      return res
        .status(400)
        .json({ message: `Character ${characterId} not found` });
    }

    const isOwner = await Character.findOne({
      _id: req.params.characterId,
      owner: owner,
    });

    if (!isOwner) {
      return res
        .status(401)
        .json({ message: `You are not the owner of this character.` });
    }

    for (let i = 0; i < toRemove.length; i++) {
      if (!character.inventory.includes(toRemove[i])) {
        return res
          .status(400)
          .json({ message: `Item ${toRemove[i]} not found in inventory.` });
      }
    }

    const newInventory = await removeFromList(character.inventory, toRemove);
    character.inventory = newInventory;

    character.save();

    return res.status(200).json({
      message: `Character successfully dropped items!`,
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

    const owner = (<any>req).user.id;

    const character = await Character.findById(characterId);

    if (!character) {
      return res
        .status(400)
        .json({ message: `Character ${characterId} not found.` });
    }

    const isOwner = await Character.findOne({
      _id: req.params.characterId,
      owner: owner,
    });

    if (!isOwner) {
      return res
        .status(401)
        .json({ message: `You are not the owner of this character.` });
    }

    for (let i = 0; i < equipping.length; i++) {
      if (!character.inventory.includes(equipping[i])) {
        return res.status(400).json({
          message: `Cannot equip item ${equipping[i]}. Item does not exist in player inventory.`,
        });
      }
      // add checks to make sure only one item of each type is equipped
    }

    const newInventory = await removeFromList(character.inventory, equipping);
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

    const owner = (<any>req).user.id;

    const character = await Character.findById(characterId);

    if (!character) {
      return res.status(400).json({ message: "Error Character not found" });
    }

    const isOwner = await Character.findOne({
      _id: req.params.characterId,
      owner: owner,
    });

    if (!isOwner) {
      return res
        .status(401)
        .json({ message: `You are not the owner of this character.` });
    }

    for (let i = 0; i < removing.length; i++) {
      if (!character.equipment.includes(removing[i])) {
        return res.status(400).json({
          message: `Cannot unequip ${removing[i]}. Item not equipped`,
        });
      }
    }

    const newEquipment = await removeFromList(character.inventory, removing);
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

// complete quest
export const completeObjective = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { characterId } = req.params;
    const { questId } = req.body;

    const owner = await (<any>req).user.id;

    const character = await Character.findById(characterId);

    if (!character) {
      return res.status(400).json({ message: "Error Character not found" });
    }

    if (!(await isOwner(characterId, owner))) {
      return res
        .status(401)
        .json({ message: "You are not the owner of this character" });
    }

    const quest = await Quest.findById(questId);

    if (!quest) {
      return res.status(400).json({ message: "quest not found" });
    }

    if (!character.questsAccepted.includes(questId)) {
      return res
        .status(400)
        .json({ message: "character is not currently on this quest." });
    }

    const itemsGranted: ObjectId[] = [];

    for (let i = 0; i < quest.itemsGranted.length; i++) {
      const item = await Item.findById(quest.itemsGranted[i]);

      if (item) {
        itemsGranted.push(item._id);
      }
    }

    console.log(itemsGranted);

    character.xp = quest.xpGranted + character.xp;
    character.inventory = character.inventory.concat(itemsGranted);
    const newQuests = await removeFromList(character.questsAccepted, [questId]);
    character.questsAccepted = newQuests;

    character.save();

    const newAcceptedBy = await removeFromList(quest.acceptedBy, [
      character.id,
    ]);
    quest.acceptedBy = newAcceptedBy;
    quest.completedBy.push(character.id);

    quest.save();

    return res.status(200).json({ message: "quest successfully completed." });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// accept quest
export const acceptQuest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { characterId } = req.params;
    const { questId } = req.body;

    const owner = (<any>req).user.id;

    const character = await Character.findById(characterId);

    if (!character) {
      return res.status(400).json({ message: "Error Character not found" });
    }

    if (!(await isOwner(characterId, owner))) {
      return res
        .status(401)
        .json({ message: `You are not the owner of this character.` });
    }

    const quest = await Quest.findById(questId);

    if (!quest) {
      return res.status(400).json({ message: "quest not found" });
    }

    character.questsAccepted.push(quest._id);
    character.save();

    quest.acceptedBy.push(character._id);
    quest.save();

    return res.status(200).json({ message: "quest successfully accepted." });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//destroy
export const deleteCharacter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { characterId } = req.params;

    const owner = (<any>req).user.id;

    const character = await Character.findById(characterId);

    if (!character) {
      return res.status(400).json({ message: "Character not found" });
    }

    const isOwner = await Character.findOne({
      _id: req.params.characterId,
      owner: owner,
    });

    if (!isOwner) {
      return res
        .status(401)
        .json({ message: `You are not the owner of this character.` });
    }

    await Character.findByIdAndDelete(characterId);

    return res
      .status(200)
      .json({ message: `Character ${characterId} successfully deleted` });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
