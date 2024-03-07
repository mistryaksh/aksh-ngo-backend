import { Request, Response } from "express";
import { AdminRoute } from "../../../middleware";
import { IController, IControllerRoutes, IGalleryProps } from "../../../interface";

import { GALLERY_PREFIX, GetJwtToken, Ok, UnAuthorized, VerifyJwtToken } from "../../../utils";
import { Admin, Gallery } from "model";

export class GalleryController implements IController {
     public routes: IControllerRoutes[] = [];
     constructor() {
          this.routes.push({
               handler: this.GetAllGallery,
               path: `/${GALLERY_PREFIX}`,
               method: "GET",
          });

          this.routes.push({
               handler: this.GetGalleryById,
               path: `/${GALLERY_PREFIX}/:galleryId`,
               method: "GET",
          });
          this.routes.push({
               handler: this.UploadNewGallery,
               method: "POST",
               path: `/${GALLERY_PREFIX}`,
               middleware: [AdminRoute],
          });
          this.routes.push({
               handler: this.UpdateGalleryById,
               method: "PUT",
               path: `/${GALLERY_PREFIX}/:galleryId`,
               middleware: [AdminRoute],
          });
          this.routes.push({
               handler: this.DeleteGalleryById,
               method: "DELETE",
               path: `/${GALLERY_PREFIX}/:galleryId`,
               middleware: [AdminRoute],
          });
     }

     public async GetAllGallery(req: Request, res: Response) {
          try {
               const gallery = await Gallery.find().sort({ createdAt: -1 }).populate("postedBy");
               return Ok(res, gallery);
          } catch (err) {
               console.log(err);
               return UnAuthorized(res, err as string);
          }
     }

     public async GetGalleryById(req: Request, res: Response) {
          try {
               const galleryId = req.params.galleryId;
               const gallery = (await Gallery.findOne({ _id: galleryId })).populate("postedBy");
               return Ok(res, gallery);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async UploadNewGallery(req: Request, res: Response) {
          try {
               const { images, title, description }: IGalleryProps = req.body;
               if (!images || !title || !description) {
                    return UnAuthorized(res, "missing fields");
               }
               const token = GetJwtToken(req);
               const verified = VerifyJwtToken(token);
               const admin = await Admin.findById({ _id: verified.id });
               const newGallery = await new Gallery({ description, images, postedBy: admin._id, title }).save();
               return Ok(res, `${newGallery.title} has been uploaded to your website`);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
     public async UpdateGalleryById(req: Request, res: Response) {
          try {
               const newGallery = await Gallery.findOneAndUpdate(
                    { _id: req.params.galleryId },
                    { $set: { ...req.body } }
               );
               return Ok(res, `${newGallery} has been uploaded to your website`);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async DeleteGalleryById(req: Request, res: Response) {
          try {
               const gallery = await Gallery.findOneAndDelete({ _id: req.params.galleryId });
               return Ok(res, `gallery has been removed`);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
}
