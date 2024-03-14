import express from "express";

import {
  getItemById,
  getAllItems,
  updateById,
  deleteById,
  createItem,
} from "../controllers/items/items";
import { checkAuth } from "../middleware/checkAuth";

const router = express.Router();

router.post("/create", checkAuth, createItem);
router.get("/", getAllItems);
router.get("/:itemId", getItemById);
router.put("/:itemId", checkAuth, updateById);
router.delete("/:itemId", checkAuth, deleteById);

export default router;
