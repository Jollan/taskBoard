import mongoose from "mongoose";

export interface IBoard {
  name: string;
  description: string;
  tasks: mongoose.Types.ObjectId[];
}

const boardSchema = new mongoose.Schema<IBoard>(
  {
    name: {
      type: String,
      required: [true, "This is a required field."],
      trim: true,
      maxlength: 50,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    tasks: [{ type: mongoose.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

const Board = mongoose.model("Board", boardSchema);

export default Board;
