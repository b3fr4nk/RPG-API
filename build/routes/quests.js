"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quests_1 = require("../controllers/quests/quests");
const checkAuth_1 = require("../middleware/checkAuth");
const router = express_1.default.Router();
router.post("/create", checkAuth_1.checkAuth, quests_1.createQuest);
router.get("/", quests_1.getAllQuests);
router.get("/:questId", quests_1.getQuestById);
router.put("/:questId", checkAuth_1.checkAuth, quests_1.updateQuest);
router.delete("/:questId", checkAuth_1.checkAuth, quests_1.deleteQuest);
exports.default = router;
