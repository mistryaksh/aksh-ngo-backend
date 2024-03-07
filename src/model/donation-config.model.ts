import { IDonationConfigProps } from "interface";
import mongoose from "mongoose";

const DonationConfigSchema = new mongoose.Schema<IDonationConfigProps>(
     {
          key_id: { type: mongoose.Schema.Types.String, required: true },
          key_secret: { type: mongoose.Schema.Types.String, required: true },
          minimumDonation: { type: mongoose.Schema.Types.String, required: true },
          active: { type: mongoose.Schema.Types.Boolean, default: false },
     },
     {
          timestamps: true,
     }
);

export const DonationConfig = mongoose.model("DonationConfig", DonationConfigSchema);
