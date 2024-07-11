import e from "express";
import * as taskController from "../controllers/task.controller";

const taskRouter = e.Router();

taskRouter
  .post("/:boardId", taskController.createTask)
  .patch("/:id", taskController.updateTask)
  .delete("/:boardId/:id", taskController.deleteTask);

export = taskRouter;
