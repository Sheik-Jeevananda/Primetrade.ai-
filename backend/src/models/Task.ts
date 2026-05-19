import mongoose from "mongoose";

export interface ITask extends mongoose.Document {
  title: string;
  description: string;
  status: string;
  createdBy: mongoose.Types.ObjectId;
}

const taskSchema = new mongoose.Schema<ITask>(
{
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


const Task = mongoose.model<ITask>("Task" , taskSchema);

export default Task;
