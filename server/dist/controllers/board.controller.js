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
exports.updateBoard = exports.createBoard = exports.getBoard = void 0;
const asyncErrorHandler_1 = __importDefault(require("../utils/asyncErrorHandler"));
const task_model_1 = __importDefault(require("../models/task.model"));
const customError_1 = __importDefault(require("../utils/customError"));
const board_model_1 = __importDefault(require("../models/board.model"));
exports.getBoard = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const board = yield board_model_1.default.findById(req.params.id).populate("tasks");
    if (!board) {
        throw new customError_1.default("The board you try to get is not found.", 404);
    }
    res.status(200).json({
        status: "success",
        data: { board },
    });
}));
exports.createBoard = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tasks = yield task_model_1.default.create([(_a = req.body.tasks) !== null && _a !== void 0 ? _a : []].flat());
    try {
        var board = yield board_model_1.default.create(Object.assign(Object.assign({}, req.body), { tasks }));
    }
    catch (error) {
        yield task_model_1.default.deleteMany({ _id: { $in: tasks } });
        throw error;
    }
    res.status(201).json({
        status: "success",
        data: { board },
    });
}));
exports.updateBoard = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    delete req.body.tasks;
    const board = yield board_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }).populate("tasks");
    if (!board) {
        throw new customError_1.default("The board you try to update is not found.", 404);
    }
    res.status(200).json({
        status: "success",
        data: { board },
    });
}));
