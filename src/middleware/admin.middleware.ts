import { Request, Response } from "express";
import { NextFunction } from "express";
import { AccountJwtError } from "interface/account.interface";
import { Admin } from "model";
import { GetJwtToken, UnAuthorized, VerifyJwtToken } from "utils";

export const AdminRoute = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const token = GetJwtToken(req);
          console.log(token);

          if (!token) {
               return UnAuthorized(res, AccountJwtError.TOKEN_NOT_EXIST);
          }

          const verify = VerifyJwtToken(token);

          if (!verify.id.length) {
               return UnAuthorized(res, AccountJwtError.TOKEN_NOT_EXIST);
          }

          const admin = await Admin.findById({ _id: verify.id });

          if (!admin) {
               return UnAuthorized(res, AccountJwtError.INVALID_ACCOUNT);
          }

          next();
     } catch (err) {
          return UnAuthorized(res, err);
     }
};
