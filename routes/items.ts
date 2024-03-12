import express from "express";

import {
  getItemById,
  getAllItems,
  updateById,
  deleteById,
  createItem,
} from "../controllers/items/items";

const router = express.Router();

router.post("/create", createItem);
router.get("/", getAllItems);
router.get("/:itemId", getItemById);
router.put("/:itemId", updateById);
router.delete("/:itemId", deleteById);

export default router;
