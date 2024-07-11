import asyncErrorHandler from "../utils/asyncErrorHandler";
import Task from "../models/task.model";
import CustomError from "../utils/customError";
import Board from "../models/board.model";

export const getBoard = asyncErrorHandler(async (req, res) => {
  const board = await Board.findById(req.params.id).populate<{
    tasks: InstanceType<typeof Task>[];
  }>("tasks");
  if (!board) {
    throw new CustomError("The board you try to get is not found.", 404);
  }
  res.status(200).json({
    status: "success",
    data: { board },
  });
});

export const createBoard = asyncErrorHandler(async (req, res) => {
  const tasks = await Task.create([req.body.tasks ?? []].flat());
  try {
    var board = await Board.create({ ...req.body, tasks });
  } catch (error) {
    await Task.deleteMany({ _id: { $in: tasks } });
    throw error;
  }
  res.status(201).json({
    status: "success",
    data: { board },
  });
});

export const updateBoard = asyncErrorHandler(async (req, res) => {
  delete req.body.tasks;
  const board = await Board.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate<{
    tasks: InstanceType<typeof Task>[];
  }>("tasks");
  
  if (!board) {
    throw new CustomError("The board you try to update is not found.", 404);
  }
  res.status(200).json({
    status: "success",
    data: { board },
  });
});
