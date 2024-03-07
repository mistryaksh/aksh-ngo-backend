import { Request } from "express";
import config from "config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const HashPassword = (password: string) => {
     return bcrypt.hashSync(password, 10);
};

export const CheckPassword = ({ hashed, password }: { hashed: string; password: string }) => {
     return bcrypt.compareSync(password, hashed);
};

export const SignJwtToken = (id: string) => {
     return jwt.sign(
          {
               id: id,
          },
          process.env.JWT_SECRET || config.get("JWT_SECRET")
     );
};

export const GetJwtToken = (req: Request) => {
     return req.headers.authorization;
};

export const VerifyJwtToken = (token: string) => {
     return jwt.verify(token, process.env.JWT_SECRET || config.get("JWT_SECRET")) as any;
};
