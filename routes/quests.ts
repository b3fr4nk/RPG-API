import express from "express";
import {
  createQuest,
  deleteQuest,
  getAllQuests,
  getQuestById,
  updateQuest,
} from "../controllers/quests/quests";
import { checkAuth } from "../middleware/checkAuth";

const router = express.Router();

router.post("/create", checkAuth, createQuest);
router.get("/", getAllQuests);
router.get("/:questId", getQuestById);
router.put("/:questId", checkAuth, updateQuest);
router.delete("/:questId", checkAuth, deleteQuest);

export default router;
