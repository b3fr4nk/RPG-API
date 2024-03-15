"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const items_1 = require("../controllers/items/items");
const checkAuth_1 = require("../middleware/checkAuth");
const router = express_1.default.Router();
router.post("/create", checkAuth_1.checkAuth, items_1.createItem);
router.get("/", items_1.getAllItems);
router.get("/:itemId", items_1.getItemById);
router.put("/:itemId", checkAuth_1.checkAuth, items_1.updateById);
router.delete("/:itemId", checkAuth_1.checkAuth, items_1.deleteById);
exports.default = router;
