import { Request, Response } from "express";
import { AdminRoute } from "../../../middleware";
import { IController, IControllerRoutes } from "../../../interface";
import { ADMIN_EVENTS, Ok, UnAuthorized } from "../../../utils";
import { Event } from "model";
import { IEventsProps } from "interface/event.interface";

export class EventController implements IController {
     public routes: IControllerRoutes[] = [];
     constructor() {
          this.routes.push({
               handler: this.RegisterNewEvent,
               path: `/${ADMIN_EVENTS}`,
               method: "POST",
               middleware: [AdminRoute],
          });
          this.routes.push({
               handler: this.GetAllEvents,
               method: "GET",
               path: `/${ADMIN_EVENTS}/all`,
          });
          this.routes.push({
               handler: this.GetEventById,
               method: "GET",
               path: `/${ADMIN_EVENTS}/:eventId`,
          });
          this.routes.push({
               handler: this.UpdateEventById,
               path: `/${ADMIN_EVENTS}/:eventId`,
               method: "PUT",
               middleware: [AdminRoute],
          });
          this.routes.push({
               handler: this.DeleteEventById,
               path: `/${ADMIN_EVENTS}/:eventId`,
               method: "DELETE",
               middleware: [AdminRoute],
          });
     }

     public async RegisterNewEvent(req: Request, res: Response) {
          try {
               const { label, subTitle, description, image, postedOn, categoryId }: IEventsProps = req.body;
               if (!label || !subTitle || !description || !image || !postedOn || !categoryId) {
                    return UnAuthorized(res, "missing fields");
               }
               const event = await new Event({
                    label,
                    subTitle,
                    description,
                    image,
                    postedOn,
                    categoryId,
               }).save();

               return Ok(res, `${event.label} is created`);
          } catch (err) {
               console.log(err);
               return UnAuthorized(res, err);
          }
     }

     public async GetAllEvents(req: Request, res: Response) {
          try {
               const event = await Event.find().sort({ createdAt: -1 }).populate("categoryId");
               return Ok(res, event);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async GetEventById(req: Request, res: Response) {
          try {
               const eventId = req.params.eventId;
               const event = await Event.findById({ _id: eventId });
               return Ok(res, event);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
     public async UpdateEventById(req: Request, res: Response) {
          try {
               const eventId = req.params.eventId;
               const event = await Event.findByIdAndUpdate({ _id: eventId }, { $set: { ...req.body } });
               return Ok(res, `${event.label} is updated`);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async DeleteEventById(req: Request, res: Response) {
          try {
               const eventId = req.params.eventId;
               const event = await Event.findByIdAndDelete({ _id: eventId });
               return Ok(res, `${event.label} is deleted`);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
}
