import express from "express";

import {
  addItemToInventory,
  createCharacter,
  equipItem,
  getAllCharacters,
  updateCharacterName,
  deleteCharacter,
} from "../controllers/characters/characters";

const router = express.Router();

//CRUD
router.post("/create", createCharacter);
router.get("/", getAllCharacters);
router.put("/:characterId/name", updateCharacterName);
router.delete("/:characterId", deleteCharacter);

//inventory management
router.put("/:characterId/inventory/add", addItemToInventory);
router.put("/:characterId/inventory/equip", equipItem);

export default router;
