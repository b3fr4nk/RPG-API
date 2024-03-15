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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// User Schema
// prettier-ignore
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});
// Hash password before saving
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // if (!this.isModified("password")) return next();
        try {
            const hashedPassword = yield bcrypt_1.default.hash(this.password, 10);
            this.password = hashedPassword;
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
// Method to compare passwords
UserSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt_1.default.compare(candidatePassword, this.password);
    });
};
// Method to get signed JWT token
UserSchema.methods.getSignedJwtToken = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });
    });
};
const User = (0, mongoose_1.model)("User", UserSchema);
exports.default = User;
