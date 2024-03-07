import mongoose from "mongoose";
import { IEventCategoryProps } from "./event-category.interface";

export interface IBlogProps {
     image: string;
     label: string;
     category?: mongoose.Schema.Types.ObjectId;
     description: string;
     postedBy: mongoose.Schema.Types.ObjectId;
     isActive?: boolean;
}
