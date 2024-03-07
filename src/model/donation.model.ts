import { IDonationProps } from "interface";
import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema<IDonationProps>(
     {
          userId: { type: mongoose.Schema.Types.String, required: true },
          amount: { type: mongoose.Schema.Types.Number, required: true },
          custName: { type: mongoose.Schema.Types.String, required: true },
          email: { type: mongoose.Schema.Types.String, required: true },
          mobile: { type: mongoose.Schema.Types.String, required: true },
          referenceId: { type: mongoose.Schema.Types.String, required: true },
          paymentToken: { type: mongoose.Schema.Types.String, required: true },
          dataId: { type: mongoose.Schema.Types, String },
          status: { type: mongoose.Schema.Types.String, required: true, default: "NOT_PERFORMED" },
     },
     {
          timestamps: true,
     }
);

export const Donation = mongoose.model<IDonationProps>("Donation", DonationSchema);
