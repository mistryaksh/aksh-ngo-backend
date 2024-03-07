import { Request, Response } from "express";

import { STATUS_CODES } from "../interface";

export const notFoundMiddleware = (_: Request, res: Response) => {
     return res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          status_code: STATUS_CODES.NOT_FOUND,
          message: "Page not found",
     });
};
