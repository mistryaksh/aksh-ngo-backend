import { IProgramProps } from "interface";
import mongoose from "mongoose";

const ProgramSchema = new mongoose.Schema<IProgramProps>(
     {
          label: { type: mongoose.Schema.Types.String, required: true },
          subTitle: { type: mongoose.Schema.Types.String, required: true },
          description: { type: mongoose.Schema.Types.String, required: true },
          requiredDonation: { type: mongoose.Schema.Types.String, required: true },
          receivedDonation: { type: mongoose.Schema.Types.String },
          categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "EventCategory", required: true },
          active: { type: mongoose.Schema.Types.Boolean, default: false },
     },
     {
          timestamps: true,
     }
);
export const Program = mongoose.model<IProgramProps>("Program", ProgramSchema);
