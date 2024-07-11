"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = void 0;
const board_model_1 = __importDefault(require("../models/board.model"));
const task_model_1 = __importDefault(require("../models/task.model"));
const asyncErrorHandler_1 = __importDefault(require("../utils/asyncErrorHandler"));
const customError_1 = __importDefault(require("../utils/customError"));
exports.createTask = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const board = yield board_model_1.default.findById(req.params.boardId);
    if (!board) {
        throw new customError_1.default("The board does not exist.", 404);
    }
    const task = yield task_model_1.default.create(req.body);
    board.tasks.push(task._id) && board.save({ validateBeforeSave: false });
    res.status(201).json({
        status: "success",
        data: { task },
    });
}));
exports.updateTask = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield task_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!task) {
        throw new customError_1.default("The task you try to update is not found.", 404);
    }
    res.status(200).json({
        status: "success",
        data: { task },
    });
}));
exports.deleteTask = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const board = yield board_model_1.default.findById(req.params.boardId);
    if (!board) {
        throw new customError_1.default("The board does not exist.", 404);
    }
    const taskId = board.tasks.find((taskId) => taskId.toString() === req.params.id);
    if (!taskId) {
        throw new customError_1.default("The task does not exist on the board.", 404);
    }
    const task = yield task_model_1.default.findByIdAndDelete(taskId);
    board.tasks = board.tasks.filter((taskId) => taskId.toString() !== (task === null || task === void 0 ? void 0 : task.id));
    board.save({ validateBeforeSave: false });
    res.status(204).json({
        status: "success",
        data: null,
    });
}));
