import { Document, Model, Schema, model } from "mongoose";

export interface IQuestDocument extends Document {
  name: string;
  completedBy: Schema.Types.ObjectId[];
  acceptedBy: Schema.Types.ObjectId[];
  objectives: string;
  xpGranted: number;
  itemsGranted: Schema.Types.ObjectId[];
}

// static methods for schemas
export interface IQuest extends IQuestDocument {}

//interface for Quest model
interface IQuestModel extends Model<IQuestDocument, {}> {}

// Quest Schema
const QuestSchema = new Schema<IQuest, IQuestModel>({
  name: {
    type: String,
    required: true,
  },
  completedBy: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  acceptedBy: [
    {
      type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
    },
  ],
});

const Quest = model<IQuest>("Quest", QuestSchema);

export default Quest;
