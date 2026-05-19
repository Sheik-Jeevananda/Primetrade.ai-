import {type Request, type Response, type NextFunction } from "express";

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404);

  const error = new Error(`Not Found - ${req.originalUrl}`);

  next(error);
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = res.statusCode === 200
    ? 500
    : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    stack:
      process.env.NODE_ENV === "production"
        ? null
        : err.stack,
  });
};