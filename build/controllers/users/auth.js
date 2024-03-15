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
exports.logout = exports.login = exports.registerAdmin = exports.register = void 0;
const Users_1 = __importDefault(require("../../models/Users"));
// Handles the registration of a new user
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const fields = {
            username,
            password,
        };
        // Check if username is already taken
        const foundUser = yield Users_1.default.findOne({
            $or: [{ username }],
        });
        if (foundUser) {
            const message = "Username is already taken";
            return res.status(400).json({ message });
        }
        const user = new Users_1.default(fields);
        const token = yield user.schema.methods.getSignedJwtToken(user._id);
        yield user.save();
        res
            .status(201)
            .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        })
            .json({
            success: true,
            message: "User created!",
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.register = register;
const registerAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, adminKey } = req.body;
        const isAdmin = true;
        const fields = {
            username,
            password,
            isAdmin,
        };
        if (adminKey !== process.env.admin_key) {
            return res.status(401).json({ message: "Incorrect admin key" });
        }
        // Check if username is already taken
        const foundUser = yield Users_1.default.findOne({
            $or: [{ username }],
        });
        if (foundUser) {
            const message = "Username is already taken";
            return res.status(400).json({ message });
        }
        const user = new Users_1.default(fields);
        const token = yield user.schema.methods.getSignedJwtToken(user._id);
        yield user.save();
        res
            .status(201)
            .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        })
            .json({
            success: true,
            message: "User created!",
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.registerAdmin = registerAdmin;
// Handles the login of a user
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield Users_1.default.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Check if password matches
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Create token
        const token = yield user.schema.methods.getSignedJwtToken(user._id);
        res
            .status(200)
            .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        })
            .json({
            success: true,
            message: "User logged in!",
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.login = login;
// Handles the logout of a user
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res
            .status(200)
            .cookie("access_token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires: new Date(0),
        })
            .json({
            success: true,
            message: "User logged out!",
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.logout = logout;
