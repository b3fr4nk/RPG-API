import { Document, Model, Schema, model } from "mongoose";

export interface IItemDocument extends Document {
  name: string;
  type: string;
  health: Number;
  attack: Number;
  defense: Number;
}

// static methods for schemas
export interface IItem extends IItemDocument {}

//interface for Item model
interface IItemModel extends Model<IItemDocument, {}> {}

// Item Schema
const ItemSchema = new Schema<IItem, IItemModel>({
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

const Item = model<IItem>("Item", ItemSchema);

export default Item;
