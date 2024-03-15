"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Quest Schema
const QuestSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    completedBy: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
        },
    ],
    acceptedBy: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
        },
    ],
    objectives: [
        {
            type: String,
            required: true,
        },
    ],
    xpGranted: {
        type: Number,
        default: 0,
    },
    itemsGranted: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
        },
    ],
});
const Quest = (0, mongoose_1.model)("Quest", QuestSchema);
exports.default = Quest;
