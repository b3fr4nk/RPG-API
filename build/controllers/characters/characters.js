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
exports.deleteCharacter = exports.acceptQuest = exports.completeObjective = exports.unequipItem = exports.equipItem = exports.removeItemFromInventory = exports.addItemToInventory = exports.updateCharacterName = exports.getAllCharacters = exports.getCharacterById = exports.createCharacter = void 0;
const Item_1 = __importDefault(require("../../models/Item"));
const Character_1 = __importDefault(require("../../models/Character"));
const Quest_1 = __importDefault(require("../../models/Quest"));
// Removes item from current location
const removeFromList = (ids, toRemove) => __awaiter(void 0, void 0, void 0, function* () {
    var items;
    items = [];
    ids.filter((player) => {
        if (toRemove.includes(player)) {
            items.push(player);
        }
    });
    return items;
});
const isOwner = (characterId, ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    const isOwner = yield Character_1.default.findOne({
        _id: characterId,
        owner: ownerId,
    });
    if (!isOwner) {
        return false;
    }
    return true;
});
//create
const createCharacter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, health, attack, defense, xp } = req.body;
        const owner = req.user.id;
        const findCharacter = yield Character_1.default.findOne({ name: name });
        if (findCharacter) {
            return res.status(400).json({
                message: `Character with name ${name} already exists. Please choose a different name.`,
            });
        }
        const fields = { name, health, attack, defense, xp, owner };
        const character = yield new Character_1.default(fields);
        yield character.save();
        return res
            .status(200)
            .json({ message: `Character ${character.id} created`, success: "true" });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.createCharacter = createCharacter;
//read
const getCharacterById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { characterId } = req.params;
        const character = yield Character_1.default.findById(characterId);
        return res
            .status(200)
            .json({ character, message: `Character ${characterId} found` });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.getCharacterById = getCharacterById;
const getAllCharacters = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const characters = yield Character_1.default.find();
        return res.status(200).json({ characters });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.getAllCharacters = getAllCharacters;
//update
const updateCharacterName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { characterId } = req.params;
        const { name } = req.body;
        const fields = { name };
        const owner = req.user.id;
        const isOwner = yield Character_1.default.findOne({
            _id: req.params.characterId,
            owner: owner,
        });
        if (!isOwner) {
            return res
                .status(401)
                .json({ message: `You are not the owner of this character.` });
        }
        yield Character_1.default.findByIdAndUpdate(characterId, fields, {
            new: true,
            select: "-__v",
        });
        return res.status(200).json({
            message: `Character ${characterId}'s name successfully updated.`,
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.updateCharacterName = updateCharacterName;
//add item to inventory
const addItemToInventory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { characterId } = req.params;
        const { itemIds } = req.body;
        const owner = req.user.id;
        const character = yield Character_1.default.findById(characterId);
        if (!character) {
            return res.status(400).json({ message: "Character not found" });
        }
        const isOwner = yield Character_1.default.findOne({
            _id: req.params.characterId,
            owner: owner,
        });
        if (!isOwner) {
            return res
                .status(401)
                .json({ message: `You are not the owner of this character.` });
        }
        const itemsNotFound = [];
        const itemsFound = [];
        for (let i = 0; i < itemIds.length; i++) {
            const itemFound = yield Item_1.default.findById(itemIds[i]);
            if (!itemFound) {
                itemsNotFound.push(itemIds[i]);
            }
            else {
                itemsFound.push(itemIds[i]);
            }
        }
        character === null || character === void 0 ? void 0 : character.inventory.push(...itemsFound); //"..." is the spread operator it allows an array to be expanded in place
        yield (character === null || character === void 0 ? void 0 : character.save());
        return res.status(200).json({
            message: `Character ${characterId} now has ${itemsFound}.`,
            itemsAdded: itemsFound,
            itemsNotAdded: itemsNotFound,
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.addItemToInventory = addItemToInventory;
//remove item from inventory
const removeItemFromInventory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { characterId } = req.params;
        const toRemove = req.body.itemIds;
        const owner = req.user.id;
        const character = yield Character_1.default.findById(characterId);
        if (!character) {
            return res
                .status(400)
                .json({ message: `Character ${characterId} not found` });
        }
        const isOwner = yield Character_1.default.findOne({
            _id: req.params.characterId,
            owner: owner,
        });
        if (!isOwner) {
            return res
                .status(401)
                .json({ message: `You are not the owner of this character.` });
        }
        for (let i = 0; i < toRemove.length; i++) {
            if (!character.inventory.includes(toRemove[i])) {
                return res
                    .status(400)
                    .json({ message: `Item ${toRemove[i]} not found in inventory.` });
            }
        }
        const newInventory = yield removeFromList(character.inventory, toRemove);
        character.inventory = newInventory;
        character.save();
        return res.status(200).json({
            message: `Character successfully dropped items!`,
            equipment: toRemove,
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.removeItemFromInventory = removeItemFromInventory;
// equip item
const equipItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { characterId } = req.params;
        const equipping = req.body.itemIds;
        const owner = req.user.id;
        const character = yield Character_1.default.findById(characterId);
        if (!character) {
            return res
                .status(400)
                .json({ message: `Character ${characterId} not found.` });
        }
        const isOwner = yield Character_1.default.findOne({
            _id: req.params.characterId,
            owner: owner,
        });
        if (!isOwner) {
            return res
                .status(401)
                .json({ message: `You are not the owner of this character.` });
        }
        for (let i = 0; i < equipping.length; i++) {
            if (!character.inventory.includes(equipping[i])) {
                return res.status(400).json({
                    message: `Cannot equip item ${equipping[i]}. Item does not exist in player inventory.`,
                });
            }
            // add checks to make sure only one item of each type is equipped
        }
        const newInventory = yield removeFromList(character.inventory, equipping);
        character.equipment = character.equipment.concat(equipping);
        character.inventory = newInventory;
        yield character.save();
        return res.status(200).json({
            message: `Character successfully equipped items!`,
            equipment: equipping,
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.equipItem = equipItem;
const unequipItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { characterId } = req.params;
        const removing = req.body.itemIds;
        const owner = req.user.id;
        const character = yield Character_1.default.findById(characterId);
        if (!character) {
            return res.status(400).json({ message: "Error Character not found" });
        }
        const isOwner = yield Character_1.default.findOne({
            _id: req.params.characterId,
            owner: owner,
        });
        if (!isOwner) {
            return res
                .status(401)
                .json({ message: `You are not the owner of this character.` });
        }
        for (let i = 0; i < removing.length; i++) {
            if (!character.equipment.includes(removing[i])) {
                return res.status(400).json({
                    message: `Cannot unequip ${removing[i]}. Item not equipped`,
                });
            }
        }
        const newEquipment = yield removeFromList(character.inventory, removing);
        character.inventory = character.inventory.concat(removing);
        character.equipment = newEquipment;
        character.save();
        return res
            .status(200)
            .json({ message: `Items successfully unequiped`, items: removing });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.unequipItem = unequipItem;
// complete quest
const completeObjective = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { characterId } = req.params;
        const { questId } = req.body;
        const owner = yield req.user.id;
        const character = yield Character_1.default.findById(characterId);
        if (!character) {
            return res.status(400).json({ message: "Error Character not found" });
        }
        if (!(yield isOwner(characterId, owner))) {
            return res
                .status(401)
                .json({ message: "You are not the owner of this character" });
        }
        const quest = yield Quest_1.default.findById(questId);
        if (!quest) {
            return res.status(400).json({ message: "quest not found" });
        }
        if (!character.questsAccepted.includes(questId)) {
            return res
                .status(400)
                .json({ message: "character is not currently on this quest." });
        }
        const itemsGranted = [];
        for (let i = 0; i < quest.itemsGranted.length; i++) {
            const item = yield Item_1.default.findById(quest.itemsGranted[i]);
            if (item) {
                itemsGranted.push(item._id);
            }
        }
        console.log(itemsGranted);
        character.xp = quest.xpGranted + character.xp;
        character.inventory = character.inventory.concat(itemsGranted);
        const newQuests = yield removeFromList(character.questsAccepted, [questId]);
        character.questsAccepted = newQuests;
        character.save();
        const newAcceptedBy = yield removeFromList(quest.acceptedBy, [
            character.id,
        ]);
        quest.acceptedBy = newAcceptedBy;
        quest.completedBy.push(character.id);
        quest.save();
        return res.status(200).json({ message: "quest successfully completed." });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.completeObjective = completeObjective;
// accept quest
const acceptQuest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { characterId } = req.params;
        const { questId } = req.body;
        const owner = req.user.id;
        const character = yield Character_1.default.findById(characterId);
        if (!character) {
            return res.status(400).json({ message: "Error Character not found" });
        }
        if (!(yield isOwner(characterId, owner))) {
            return res
                .status(401)
                .json({ message: `You are not the owner of this character.` });
        }
        const quest = yield Quest_1.default.findById(questId);
        if (!quest) {
            return res.status(400).json({ message: "quest not found" });
        }
        character.questsAccepted.push(quest._id);
        character.save();
        quest.acceptedBy.push(character._id);
        quest.save();
        return res.status(200).json({ message: "quest successfully accepted." });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.acceptQuest = acceptQuest;
//destroy
const deleteCharacter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { characterId } = req.params;
        const owner = req.user.id;
        const character = yield Character_1.default.findById(characterId);
        if (!character) {
            return res.status(400).json({ message: "Character not found" });
        }
        const isOwner = yield Character_1.default.findOne({
            _id: req.params.characterId,
            owner: owner,
        });
        if (!isOwner) {
            return res
                .status(401)
                .json({ message: `You are not the owner of this character.` });
        }
        yield Character_1.default.findByIdAndDelete(characterId);
        return res
            .status(200)
            .json({ message: `Character ${characterId} successfully deleted` });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.deleteCharacter = deleteCharacter;
