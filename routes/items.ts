import Express from "express";

import {
  getItemById,
  getAllItems,
  updateById,
  deleteById,
  createItem,
} from "../controllers/items/items";

const router = Express.Router();

router.use("/items", router);

router.post("/create", createItem);
router.get("/", getAllItems);
router.get("/:itemId", getItemById);
router.put("/:itemId", updateById);
router.delete("/:itemId", deleteById);

export default router;
