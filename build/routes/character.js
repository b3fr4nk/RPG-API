"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const characters_1 = require("../controllers/characters/characters");
const checkAuth_1 = require("../middleware/checkAuth");
const router = express_1.default.Router();
//CRUD
router.post("/create", checkAuth_1.checkAuth, characters_1.createCharacter);
router.get("/", characters_1.getAllCharacters);
router.put("/:characterId/name", checkAuth_1.checkAuth, characters_1.updateCharacterName);
router.delete("/:characterId", checkAuth_1.checkAuth, characters_1.deleteCharacter);
//inventory management
router.put("/:characterId/inventory/add", checkAuth_1.checkAuth, characters_1.addItemToInventory);
router.put("/:characterId/inventory/drop", checkAuth_1.checkAuth, characters_1.removeItemFromInventory);
router.put("/:characterId/inventory/equip", checkAuth_1.checkAuth, characters_1.equipItem);
router.put("/:characterId/inventory/unequip", checkAuth_1.checkAuth, characters_1.unequipItem);
//quest management
router.put("/:characterId/quests/add", checkAuth_1.checkAuth, characters_1.acceptQuest);
router.put("/:characterId/quests/complete", checkAuth_1.checkAuth, characters_1.completeObjective);
exports.default = router;
