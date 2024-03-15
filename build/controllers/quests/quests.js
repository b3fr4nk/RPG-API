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
exports.deleteQuest = exports.updateQuest = exports.getQuestById = exports.getAllQuests = exports.createQuest = void 0;
const Users_1 = __importDefault(require("../../models/Users"));
const Quest_1 = __importDefault(require("../../models/Quest"));
// create quest
const createQuest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, objectives, itemsGranted, xpGranted } = req.body;
        const userId = req.user.id;
        const user = yield Users_1.default.findById(userId);
        if (!user) {
            return res
                .status(401)
                .json({ message: "you must be an admin user to do this." });
        }
        if (!user.isAdmin) {
            return res
                .status(401)
                .json({ message: "you must be an admin user to do this" });
        }
        const findQuest = yield Quest_1.default.findOne({ name: name });
        if (findQuest) {
            return res.status(400).json({
                message: `quest named ${name} already exists create a new one`,
            });
        }
        const fields = { name, objectives, itemsGranted, xpGranted };
        const quest = yield Quest_1.default.create(fields);
        quest.save();
        return res.status(200).json({ message: "quest created", success: "true" });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.createQuest = createQuest;
// Read quest
const getAllQuests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quests = yield Quest_1.default.find();
        return res.status(200).json({ quests });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.getAllQuests = getAllQuests;
const getQuestById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questId } = req.params;
        const quest = yield Quest_1.default.findById(questId);
        if (!quest) {
            return res.status(400).json({ message: `Quest ${questId} not found.` });
        }
        return res.status(200).json({ quest });
    }
    catch (err) { }
});
exports.getQuestById = getQuestById;
// update quest
const updateQuest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questId } = req.params;
        const { name, objectives, xpGranted } = req.body;
        const fields = { name, objectives, xpGranted };
        const userId = req.user.id;
        const user = yield Users_1.default.findById(userId);
        if (!user) {
            return res
                .status(401)
                .json({ message: "you must be an admin user to do this." });
        }
        if (!user.isAdmin) {
            return res
                .status(401)
                .json({ message: "you must be an admin user to do this" });
        }
        const questFound = yield Quest_1.default.findById(questId);
        if (!questFound) {
            return res.status(200).json({ message: `quest ${questId} not found.` });
        }
        const quest = yield Quest_1.default.findByIdAndUpdate(questId, fields, {
            new: true,
            select: "-__v",
        });
        return res
            .status(200)
            .json({ message: `Quest ${questId} successfully updated.` });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.updateQuest = updateQuest;
//delete quest
const deleteQuest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questId } = req.params;
        const userId = req.user.id;
        const user = yield Users_1.default.findById(userId);
        if (!user) {
            return res
                .status(401)
                .json({ message: "you must be an admin user to do this." });
        }
        if (!user.isAdmin) {
            return res
                .status(401)
                .json({ message: "you must be an admin user to do this" });
        }
        yield Quest_1.default.findByIdAndDelete(questId);
        return res
            .status(200)
            .json({ message: `Quest ${questId} successfully deleted.` });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.deleteQuest = deleteQuest;
