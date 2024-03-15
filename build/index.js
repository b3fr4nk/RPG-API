"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const items_1 = __importDefault(require("./routes/items"));
const character_1 = __importDefault(require("./routes/character"));
const accounts_1 = __importDefault(require("./routes/accounts"));
const quests_1 = __importDefault(require("./routes/quests"));
const app = (0, express_1.default)();
// Database
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log("Database connected!");
})
    .catch((err) => {
    console.log(err);
});
//middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
// routes
const baseRoute = "/api/v1";
app.use(`${baseRoute}/items`, items_1.default);
app.use(`${baseRoute}/characters`, character_1.default);
app.use(`${baseRoute}/users`, accounts_1.default);
app.use(`${baseRoute}/quests`, quests_1.default);
app.listen("3000", () => {
    console.log("Server listening on port 3000");
});
exports.default = app;
