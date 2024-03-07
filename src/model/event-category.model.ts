import { IEventCategoryProps } from "interface/event-category.interface";
import mongoose from "mongoose";

const EventCategorySchema = new mongoose.Schema<IEventCategoryProps>(
     {
          label: { type: mongoose.Schema.Types.String, required: true },
          subTitle: { type: mongoose.Schema.Types.String, required: true },
          active: { type: mongoose.Schema.Types.Boolean, default: false },
     },
     {
          timestamps: true,
     }
);

export const EventCategory = mongoose.model<IEventCategoryProps>("EventCategory", EventCategorySchema);
