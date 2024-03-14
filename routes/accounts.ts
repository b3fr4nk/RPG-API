import express from "express";
import { checkAuth } from "../middleware/checkAuth";

import {
  register,
  login,
  logout,
  registerAdmin,
} from "../controllers/users/auth";

import {
  getUserById,
  getCurrentUser,
  updateUserProfile,
  deleteUserAccount,
} from "../controllers/users/user";

const router = express.Router();

// Auth routes
router.post("/auth/register", register);
router.post("/auth/register/admin", registerAdmin);
router.post("/auth/login", login);
router.post("/auth/logout", checkAuth, logout);

// User routes
router.get("/me", checkAuth, getCurrentUser);
router.put("/me", checkAuth, updateUserProfile);
router.delete("/me", checkAuth, deleteUserAccount);
router.get("/:userId", getUserById);

export default router;
