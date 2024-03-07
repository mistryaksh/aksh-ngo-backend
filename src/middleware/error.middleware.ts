import { Request, NextFunction, Response } from "express";

import { STATUS_CODES } from "../interface";

export const errorHandler = (err: any, _: Request, res: Response, next: NextFunction): Response | void => {
     if (err.name === "ApiError") {
          return res.status(STATUS_CODES.BAD_REQUEST).json({
               success: false,
               status_code: STATUS_CODES.BAD_REQUEST,
               message: err.message,
          });
     }
     if (err.name === "AuthError") {
          return res.status(STATUS_CODES.UNAUTHORIZED).json({
               success: false,
               status_code: STATUS_CODES.UNAUTHORIZED,
               message: err.message,
          });
     }
     if (err instanceof Error) {
          return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
               success: false,
               status_code: STATUS_CODES.INTERNAL_SERVER_ERROR,
               message: "Internal server error",
          });
     }
     next();
};
