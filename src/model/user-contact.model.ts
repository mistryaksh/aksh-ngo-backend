import { IUserContactProps } from "interface";
import mongoose from "mongoose";

const UserContactSchema = new mongoose.Schema<IUserContactProps>(
     {
          message: { type: mongoose.Schema.Types.String, required: true },
          fullName: { type: mongoose.Schema.Types.String, required: true },
          email: { type: mongoose.Schema.Types.String, required: true },
          subject: { type: mongoose.Schema.Types.String },
     },
     { timestamps: true }
);
export const UserContact = mongoose.model<IUserContactProps>("UserContact", UserContactSchema);
