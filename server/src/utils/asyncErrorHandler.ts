import e from "express";
import CustomError from "./customError";

type AsyncRequestHandler = (
  req: e.Request,
  res: e.Response,
  next: e.NextFunction
) => Promise<any>;

const errorMap = {
  ["CastError"](error: any) {
    const message = `Invalid value for ${error.path}: ${error.value}!`;
    return new CustomError(message, 400);
  },
  ["ValidationError"](error: any) {
    return new CustomError(error.message, 400);
  },
  ["genericError"](error: any) {
    const message = "Something went wrong! Please try again later.";
    return new CustomError(message, 500);
  },
};

function asyncErrorHandler(fn: AsyncRequestHandler): e.RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      if (
        process.env.NODE_ENV === "production" &&
        !(error.name === "CustomError")
      ) {
        let errorKey: keyof typeof errorMap = error.name;
        errorKey = errorKey in errorMap ? errorKey : "genericError";
        error = errorMap[errorKey](error);
      }
      next(error);
    });
  };
}

export default asyncErrorHandler;
