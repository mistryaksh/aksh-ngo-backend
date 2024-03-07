import { IEventsProps } from "interface/event.interface";
import mongoose from "mongoose";

const EventSchema = new mongoose.Schema<IEventsProps>(
     {
          image: { type: mongoose.Schema.Types.String, required: true },
          label: { type: mongoose.Schema.Types.String, required: true },
          subTitle: { type: mongoose.Schema.Types.String, required: true },
          postedOn: { type: mongoose.Schema.Types.Date, required: true },
          description: { type: mongoose.Schema.Types.String, required: true },
          // bannerImage: { type: mongoose.Schema.Types.String, required: true },
          active: { type: mongoose.Schema.Types.Boolean, default: false },
          categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "EventCategory", required: true },
     },
     {
          timestamps: true,
     }
);

export const Event = mongoose.model<IEventsProps>("Event", EventSchema);
