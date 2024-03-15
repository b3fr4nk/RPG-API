"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserAccount = exports.updateUserProfile = exports.getCurrentUser = exports.getUserById = void 0;
const Users_1 = __importDefault(require("../../models/Users"));
// Find specific user by id
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield Users_1.default.findById(req.params.id).select("username");
        return res.status(200).json({
            success: true,
            user,
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.getUserById = getUserById;
const getCurrentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let user = yield Users_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).select("username");
        return res.status(200).json({
            user,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.getCurrentUser = getCurrentUser;
const updateUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { username } = req.body;
        const fields = {
            username,
        };
        // Check if username or email is already taken
        const foundUser = yield Users_1.default.findOne({
            $or: [{ username }],
        });
        if (foundUser) {
            const message = "username is already taken";
            return res.status(400).json({ message });
        }
        const selectFields = Object.keys(fields).join(" ");
        const user = yield Users_1.default.findByIdAndUpdate((_b = req.user) === null || _b === void 0 ? void 0 : _b.id, fields, {
            new: true,
            select: selectFields,
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.updateUserProfile = updateUserProfile;
const deleteUserAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        yield Users_1.default.findByIdAndDelete((_c = req.user) === null || _c === void 0 ? void 0 : _c.id);
        res.status(200).json({
            success: true,
            message: "User deleted",
        });
    }
    catch (err) {
        res.status(500).json({ message: err });
        next(err);
    }
});
exports.deleteUserAccount = deleteUserAccount;
