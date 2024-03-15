"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Item Schema
const ItemSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["armor", "melee", "ranged"],
        required: true,
    },
    health: {
        type: Number,
        required: true,
        default: 0,
    },
    attack: {
        type: Number,
        required: true,
        default: 0,
    },
    defense: {
        type: Number,
        required: true,
        default: 0,
    },
});
const Item = (0, mongoose_1.model)("Item", ItemSchema);
exports.default = Item;
