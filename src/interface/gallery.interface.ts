import { IAdminProps } from "./admin.interface";

export interface IGalleryProps {
     images: string[];
     title: string;
     description?: string;
     postedBy: IAdminProps;
}
