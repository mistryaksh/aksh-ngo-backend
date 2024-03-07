import { IGalleryProps } from "interface";
import mongoose from "mongoose";
const GallerySchema = new mongoose.Schema<IGalleryProps>(
     {
          images: [{ type: mongoose.Schema.Types.String, required: true }],
          title: { type: mongoose.Schema.Types.String, required: true },
          description: { type: mongoose.Schema.Types.String },
          postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
     },
     {
          timestamps: true,
     }
);

export const Gallery = mongoose.model<IGalleryProps>("Gallery", GallerySchema);
