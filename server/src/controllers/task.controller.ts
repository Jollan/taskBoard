import Board from "../models/board.model";
import Task from "../models/task.model";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import CustomError from "../utils/customError";

export const createTask = asyncErrorHandler(async (req, res) => {
  const board = await Board.findById(req.params.boardId);
  if (!board) {
    throw new CustomError("The board does not exist.", 404);
  }
  const task = await Task.create(req.body);
  board.tasks.push(task._id) && board.save({ validateBeforeSave: false });
  res.status(201).json({
    status: "success",
    data: { task },
  });
});

export const updateTask = asyncErrorHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!task) {
    throw new CustomError("The task you try to update is not found.", 404);
  }
  res.status(200).json({
    status: "success",
    data: { task },
  });
});

export const deleteTask = asyncErrorHandler(async (req, res) => {
  const board = await Board.findById(req.params.boardId);
  if (!board) {
    throw new CustomError("The board does not exist.", 404);
  }
  const taskId = board.tasks.find(
    (taskId) => taskId.toString() === req.params.id
  );
  if (!taskId) {
    throw new CustomError("The task does not exist on the board.", 404);
  }
  const task = await Task.findByIdAndDelete(taskId);
  board.tasks = board.tasks.filter((taskId) => taskId.toString() !== task?.id);
  board.save({ validateBeforeSave: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});
