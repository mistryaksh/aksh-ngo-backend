import { Request, Response } from "express";
import { AdminRoute } from "../../../middleware";
import { IContactProps, IController, IControllerRoutes } from "../../../interface";

import { ADMIN_CONTACT, Ok, UnAuthorized } from "../../../utils";
import { Contact } from "model/contact.model";

export class ContactController implements IController {
     public routes: IControllerRoutes[] = [];
     constructor() {
          this.routes.push({
               handler: this.UploadNewContact,
               path: `/${ADMIN_CONTACT}`,
               method: "POST",
               middleware: [AdminRoute],
          });
          this.routes.push({
               handler: this.GetAllContact,
               path: `/${ADMIN_CONTACT}`,
               method: "GET",
          });
          this.routes.push({
               handler: this.GetContactById,
               method: "PUT",
               path: `/${ADMIN_CONTACT}/:contactId`,
          });
          this.routes.push({
               handler: this.UpdateContactById,
               method: "PUT",
               path: `/${ADMIN_CONTACT}/:contactId`,
               middleware: [AdminRoute],
          });
          this.routes.push({
               handler: this.DeleteContactById,
               method: "DELETE",
               path: `/${ADMIN_CONTACT}/:contactId`,
               middleware: [AdminRoute],
          });
     }

     public async UploadNewContact(req: Request, res: Response) {
          try {
               const { address, email, helplineNumbers, mobile }: IContactProps = req.body;
               if (!address || !email || !helplineNumbers || !mobile) {
                    return UnAuthorized(res, "missing fields");
               }
               const newContact = await new Contact({
                    address,
                    email,
                    helplineNumbers,
                    mobile,
               }).save();
               return Ok(res, `${newContact.mobile} is created`);
          } catch (err) {
               return UnAuthorized(res, err as string);
          }
     }

     public async GetAllContact(req: Request, res: Response) {
          try {
               const contact = await Contact.find().sort({ createdAt: -1 });
               return Ok(res, contact);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async GetContactById(req: Request, res: Response) {
          try {
               const contactId = req.params.contactId;
               const contact = await Contact.findById({ _id: contactId });
               return Ok(res, contact);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async UpdateContactById(req: Request, res: Response) {
          try {
               const contactId = req.params.contactId;
               const contact = await Contact.findByIdAndUpdate({ _id: contactId }, { $set: { ...req.body } });
               return Ok(res, `${contact.mobile} is updated`);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
     public async DeleteContactById(req: Request, res: Response) {
          try {
               const contactId = req.params.contactId;
               const contact = await Contact.findByIdAndDelete({ _id: contactId });
               return Ok(res, `${contact.mobile} is deleted`);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
}
