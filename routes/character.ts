import express from "express";

import {
  addItemToInventory,
  createCharacter,
  equipItem,
  getAllCharacters,
  updateCharacterName,
  deleteCharacter,
  unequipItem,
  removeItemFromInventory,
} from "../controllers/characters/characters";

import { checkAuth } from "../middleware/checkAuth";

const router = express.Router();

//CRUD
router.post("/create", checkAuth, createCharacter);
router.get("/", getAllCharacters);
router.put("/:characterId/name", checkAuth, updateCharacterName);
router.delete("/:characterId", checkAuth, deleteCharacter);

//inventory management
router.put("/:characterId/inventory/add", checkAuth, addItemToInventory);
router.put("/:characterId/inventory/drop", checkAuth, removeItemFromInventory);
router.put("/:characterId/inventory/equip", checkAuth, equipItem);
router.put("/:characterId/inventory/unequip", checkAuth, unequipItem);

export default router;
