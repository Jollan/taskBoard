import e from "express";
import * as boardController from "../controllers/board.controller";

const boardRouter = e.Router();

boardRouter.post("/", boardController.createBoard);
boardRouter
  .route("/:id")
  .get(boardController.getBoard)
  .patch(boardController.updateBoard);

export = boardRouter;
