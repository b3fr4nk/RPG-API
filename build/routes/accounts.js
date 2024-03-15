"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../middleware/checkAuth");
const auth_1 = require("../controllers/users/auth");
const user_1 = require("../controllers/users/user");
const router = express_1.default.Router();
// Auth routes
router.post("/auth/register", auth_1.register);
router.post("/auth/register/admin", auth_1.registerAdmin);
router.post("/auth/login", auth_1.login);
router.post("/auth/logout", checkAuth_1.checkAuth, auth_1.logout);
// User routes
router.get("/me", checkAuth_1.checkAuth, user_1.getCurrentUser);
router.put("/me", checkAuth_1.checkAuth, user_1.updateUserProfile);
router.delete("/me", checkAuth_1.checkAuth, user_1.deleteUserAccount);
router.get("/:userId", user_1.getUserById);
exports.default = router;
