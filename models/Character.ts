import { Document, Model, Schema, model } from "mongoose";

export interface ICharacterDocument extends Document {
  name: string;
  owner: Schema.Types.ObjectId;
  items: Schema.Types.ObjectId[];
  health: Number;
  attack: Number;
  defense: Number;
  xp: Number;
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
  },
  items: [
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
