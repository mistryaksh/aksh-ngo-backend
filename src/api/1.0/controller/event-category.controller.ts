import { Request, Response } from "express";
import { AdminRoute } from "../../../middleware";
import { IController, IControllerRoutes } from "../../../interface";
import { ADMIN_EVENTS_CATEGORY, Ok, UnAuthorized } from "../../../utils";
import { EventCategory } from "model";
import { IEventCategoryProps } from "interface/event-category.interface";
import { IEventsProps } from "interface/event.interface";

export class EventCategoryController implements IController {
     public routes: IControllerRoutes[] = [];
     constructor() {
          this.routes.push({
               handler: this.RegisterNewEventCategory,
               path: `/${ADMIN_EVENTS_CATEGORY}`,
               method: "POST",
               middleware: [AdminRoute],
          });
          this.routes.push({
               handler: this.GetAllEventsCategory,
               method: "GET",
               path: `/${ADMIN_EVENTS_CATEGORY}/all`,
          });
          this.routes.push({
               handler: this.GetEventCategoryById,
               method: "GET",
               path: `/${ADMIN_EVENTS_CATEGORY}/:categoryId`,
          });
          this.routes.push({
               handler: this.UpdateEventCategoryById,
               path: `/${ADMIN_EVENTS_CATEGORY}/by-id/:categoryId`,
               method: "PUT",
               middleware: [AdminRoute],
          });
          this.routes.push({
               handler: this.DeleteEventCategoryById,
               path: `/${ADMIN_EVENTS_CATEGORY}/:categoryId`,
               method: "DELETE",
               middleware: [AdminRoute],
          });
     }

     public async RegisterNewEventCategory(req: Request, res: Response) {
          try {
               const { label, subTitle }: IEventCategoryProps = req.body;
               if (!label || !subTitle) {
                    return UnAuthorized(res, "missing fields");
               }
               const newEvents = await new EventCategory({
                    label,
                    subTitle,
               }).save();

               return Ok(res, `${newEvents.label} is created`);
          } catch (err) {
               return UnAuthorized(res, err as string);
          }
     }

     public async GetAllEventsCategory(req: Request, res: Response) {
          try {
               const categories = await EventCategory.find().sort({ createdAt: -1 });
               return Ok(res, categories);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async GetEventCategoryById(req: Request, res: Response) {
          try {
               const categoryId = req.params.categoryId;
               const category = await EventCategory.findById({ _id: categoryId });
               return Ok(res, category);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
     public async UpdateEventCategoryById(req: Request, res: Response) {
          try {
               const categoryId = req.params.categoryId;
               const category = await EventCategory.findByIdAndUpdate({ _id: categoryId }, { $set: { ...req.body } });
               return Ok(res, `${category.label} is updated`);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async DeleteEventCategoryById(req: Request, res: Response) {
          try {
               const categoryId = req.params.categoryId;
               const category = await EventCategory.findByIdAndDelete({ _id: categoryId });
               return Ok(res, `${category.label} is deleted`);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
}
