import { Document, Model, Schema, model } from "mongoose";

export interface ICharacterDocument extends Document {
  name: string;
  owner: Schema.Types.ObjectId;
  equipment: Schema.Types.ObjectId[];
  inventory: Schema.Types.ObjectId[];
  health: number;
  attack: number;
  defense: number;
  xp: number;
  questsAccepted: Schema.Types.ObjectId[];
}

// static methods for schemas
export interface ICharacter extends ICharacterDocument {}

//interface for Character model
interface ICharacterModel extends Model<ICharacterDocument, {}> {}

// Character Schema
const CharacterSchema = new Schema<ICharacter, ICharacterModel>({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  equipment: [
    {
      type: Schema.Types.ObjectId,
      required: false,
    },
  ],
  inventory: [
    {
      type: Schema.Types.ObjectId,
      required: false,
    },
  ],
  questsAccepted: [
    {
      type: Schema.Types.ObjectId,
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

const Character = model<ICharacter>("Character", CharacterSchema);

export default Character;
