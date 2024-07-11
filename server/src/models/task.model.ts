import mongoose from "mongoose";

// const status = ["wontdo", "inprogress", "completed"] as const;
// type Status = (typeof status)[number];

export interface ITask {
  name: string;
  description: string;
  icon: string;
  status: string;
}

const taskSchema = new mongoose.Schema<ITask>(
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
    icon: {
      type: String,
      required: [true, "This is a required field."],
      trim: true,
    },
    status: {
      type: String,
      required: [true, "This is a required field."],
      trim: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
