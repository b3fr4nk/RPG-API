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
exports.deleteById = exports.updateById = exports.getAllItems = exports.getItemById = exports.createItem = void 0;
const Item_1 = __importDefault(require("../../models/Item"));
const Users_1 = __importDefault(require("../../models/Users"));
//create
const createItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //add auth stuff
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
        const { name, type, health, attack, defense } = req.body;
        const foundItem = yield Item_1.default.findOne({ name: name });
        if (foundItem) {
            return res.status(400).json({ message: "item already exists" });
        }
        const fields = { name, type, health, attack, defense };
        const item = new Item_1.default(fields);
        yield item.save();
        return res.status(200).json({ success: "true", item: item.id });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.createItem = createItem;
//read
const getItemById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId } = req.params;
        console.log(itemId);
        const item = yield Item_1.default.findById(itemId);
        if (item) {
            return res.status(200).json({ item, message: `Item ${itemId} found` });
        }
        return res.status(400).json({ message: `Item ${itemId} not found` });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.getItemById = getItemById;
const getAllItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield Item_1.default.find();
        return res.status(200).json({ items });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.getAllItems = getAllItems;
//update
const updateById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { health, attack, defense } = req.body;
        const fields = { health, attack, defense };
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
        const item = yield Item_1.default.findByIdAndUpdate(req.params.itemId, fields, {
            new: true,
            select: "-__v",
        });
        return res
            .status(200)
            .json({ message: `Item ${req.params.itemId} updated` });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.updateById = updateById;
//destroy
const deleteById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
        yield Item_1.default.findByIdAndDelete(req.params.itemId);
        return res
            .status(200)
            .json({ message: `Item ${req.params.itemId} was deleted` });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.deleteById = deleteById;
