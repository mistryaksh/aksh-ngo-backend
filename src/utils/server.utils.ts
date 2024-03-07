import Jwt from "jsonwebtoken";
import Config from "config";
import { Response, Request } from "express";

import { STATUS_CODES, RESPONSE_MESSAGE } from "../interface";

export const normalizePort = (val: number | string): number | string | boolean => {
     const normolizedPort = typeof val === "string" ? parseInt(val, 10) : val;
     if (isNaN(normolizedPort)) {
          return val;
     }

     if (normolizedPort >= 0) {
          return normolizedPort;
     }

     return false;
};

export class AuthError extends Error {
     constructor(message?: string) {
          super(message);
          this.name = "AuthError";
     }
}

export class ApiError extends Error {
     constructor(message?: string) {
          super(message);
          this.name = "ApiError";
     }
}

export enum ERROR_MESSAGE {
     INVALID_JWT_TOKEN = "Invalid jwt token",
}

export const Ok = (res: Response, data: any) => {
     res.status(STATUS_CODES.OK).json({
          success: true,
          data,
          status_code: RESPONSE_MESSAGE.OK,
     });
};

export const Created = (res: Response, data: any) => {
     res.status(STATUS_CODES.CREATED).json({
          success: true,
          data,
          status_code: RESPONSE_MESSAGE.CREATED,
     });
};

export const NoContent = (res: Response) => {
     res.status(STATUS_CODES.NO_CONTENT).json({
          success: true,
          status_code: STATUS_CODES.NO_CONTENT,
     });
};

export const BadRequest = (res: Response, message: string) => {
     res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          status_code: STATUS_CODES.BAD_REQUEST,
          message,
     });
};

export const NotFound = (res: Response, message: string) => {
     res.status(STATUS_CODES.NOT_FOUND).json({
          success: false,
          status_code: STATUS_CODES.NOT_FOUND,
          message,
     });
};

export const UnAuthorized = (res: Response, message: string | any) => {
     res.status(STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          status_code: STATUS_CODES.UNAUTHORIZED,
          message,
     });
};

export const Forbidden = (res: Response, message: string) => {
     res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          status_code: STATUS_CODES.FORBIDDEN,
          message,
     });
};
