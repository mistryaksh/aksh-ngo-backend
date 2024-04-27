import mongoose from "mongoose";

export interface IProgramProps {
  label: string;
  subTitle: string;
  description: string;
  requiredDonation: string;
  receivedDonation?: string;
  categoryId: mongoose.Schema.Types.ObjectId;
  active: boolean;
}
