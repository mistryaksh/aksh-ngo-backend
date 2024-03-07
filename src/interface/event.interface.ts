import { ObjectId } from "mongoose";

export interface IEventsProps {
     image: string;
     label: string; // title
     subTitle: string;
     postedOn: Date;
     description: string; //should be an rich text string
     // bannerImage: string;
     active: boolean;
     categoryId: ObjectId;
}
