import { IContactProps } from "interface";
import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema<IContactProps>(
     {
          email: { type: mongoose.Schema.Types.String, required: true },
          mobile: { type: mongoose.Schema.Types.String, required: true },
          helplineNumbers: [{ type: mongoose.Schema.Types.String, required: true }],
          address: [{ type: mongoose.Schema.Types.String, required: true }],
          active: { type: mongoose.Schema.Types.Boolean, default: false },
     },
     {
          timestamps: true,
     }
);
export const Contact = mongoose.model<IContactProps>("Contact", ContactSchema);
