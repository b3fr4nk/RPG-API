import { Document, Model, Schema, model } from "mongoose";

export interface IQuestDocument extends Document {
  name: string;
  objectives: string[];
  acceptedBy: Schema.Types.ObjectId[];
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
  objectives: [
    {
      type: String,
      required: true,
    },
  ],
  acceptedBy: [
    {
      type: Schema.Types.ObjectId,
      default: [],
    },
  ],
});

const Quest = model<IQuest>("Quest", QuestSchema);

export default Quest;
