"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = __importDefault(require("./customError"));
const errorMap = {
    ["CastError"](error) {
        const message = `Invalid value for ${error.path}: ${error.value}!`;
        return new customError_1.default(message, 400);
    },
    ["ValidationError"](error) {
        return new customError_1.default(error.message, 400);
    },
    ["genericError"](error) {
        const message = "Something went wrong! Please try again later.";
        return new customError_1.default(message, 500);
    },
};
function asyncErrorHandler(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => {
            if (process.env.NODE_ENV === "production" &&
                !(error.name === "CustomError")) {
                let errorKey = error.name;
                errorKey = errorKey in errorMap ? errorKey : "genericError";
                error = errorMap[errorKey](error);
            }
            next(error);
        });
    };
}
exports.default = asyncErrorHandler;
