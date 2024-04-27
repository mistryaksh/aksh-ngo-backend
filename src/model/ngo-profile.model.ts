import { INgoProfileProps } from "interface";
import mongoose from "mongoose";

const NgoProfileSchema = new mongoose.Schema<INgoProfileProps>(
  {
    description: { type: mongoose.Schema.Types.String, required: true },
    vision: { type: mongoose.Schema.Types.String, required: true },
    mission: { type: mongoose.Schema.Types.String, required: true },
    active: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
      required: false,
    },
    director: [
      {
        name: { type: mongoose.Schema.Types.String, required: true },
        description: { type: mongoose.Schema.Types.String, required: true },
        image: { type: mongoose.Schema.Types.String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const NgoProfile = mongoose.model<INgoProfileProps>("NgoProfile", NgoProfileSchema);
