"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const boardSchema = new mongoose_1.default.Schema({
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
    tasks: [{ type: mongoose_1.default.Types.ObjectId, ref: "Task" }],
}, { timestamps: true });
const Board = mongoose_1.default.model("Board", boardSchema);
exports.default = Board;
