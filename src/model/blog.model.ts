import { IBlogProps } from "interface";
import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema<IBlogProps>({
     image: { type: mongoose.Schema.Types.String, required: true },
     label: { type: mongoose.Schema.Types.String, required: true },
     category: { type: mongoose.Schema.Types.ObjectId, ref: "EventCategory" },
     description: { type: mongoose.Schema.Types.String, required: true },
     postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
     isActive: { type: mongoose.Schema.Types.Boolean, default: false },
});

export const Blog = mongoose.model<IBlogProps>("Blog", BlogSchema);
