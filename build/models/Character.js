"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Character Schema
const CharacterSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    equipment: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            required: false,
        },
    ],
    inventory: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            required: false,
        },
    ],
    questsAccepted: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
        },
    ],
    health: {
        type: Number,
        required: true,
        default: 100,
    },
    attack: {
        type: Number,
        required: true,
        default: 10,
    },
    defense: {
        type: Number,
        required: true,
        default: 10,
    },
    xp: {
        type: Number,
        required: true,
        default: 0,
    },
});
const Character = (0, mongoose_1.model)("Character", CharacterSchema);
exports.default = Character;
