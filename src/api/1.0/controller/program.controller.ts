import { Request, Response } from "express";
import { IController, IControllerRoutes, IProgramProps } from "interface";
import { AdminRoute } from "middleware";
import { Program } from "model";
import { ADMIN_PROGRAM, Ok, UnAuthorized } from "utils";

export class ProgramController implements IController {
     public routes: IControllerRoutes[] = [];
     constructor() {
          this.routes.push({
               handler: this.UploadNewProgram,
               method: "POST",
               path: `/${ADMIN_PROGRAM}/`,
               middleware: [AdminRoute],
          });
          this.routes.push({
               handler: this.GetAllPrograms,
               method: "GET",
               path: `/${ADMIN_PROGRAM}/all`,
          });
          this.routes.push({
               handler: this.GetProgramById,
               method: "GET",
               path: `/${ADMIN_PROGRAM}/by-id/:programId`,
          });
          this.routes.push({
               handler: this.UpdateProgramById,
               method: "PUT",
               path: `${ADMIN_PROGRAM}/:programId`,
               middleware: [AdminRoute],
          });
          this.routes.push({
               handler: this.DeleteProgramById,
               method: "DELETE",
               path: `${ADMIN_PROGRAM}/:programId`,
          });
     }

     public async UploadNewProgram(req: Request, res: Response) {
          try {
               const { categoryId, description, label, requiredDonation, subTitle }: IProgramProps = req.body;
               if (!categoryId || !description || !label || !requiredDonation || !subTitle) {
                    return UnAuthorized(res, "missing field");
               }
               const newProgram = await new Program({
                    categoryId,
                    description,
                    label,
                    requiredDonation,
                    subTitle,
               }).save();

               return Ok(res, `${newProgram.label} is created`);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async GetAllPrograms(req: Request, res: Response) {
          try {
               const program = await Program.find().sort({ createdAt: -1 });
               return Ok(res, program);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async GetProgramById(req: Request, res: Response) {
          try {
               const programId = req.params.programId;
               const program = await Program.findById({ _id: programId });
               return Ok(res, program);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async UpdateProgramById(req: Request, res: Response) {
          try {
               const programId = req.params.programId;
               const updatedProgram = await Program.findOneAndUpdate(
                    { _id: programId },
                    { $set: { ...req.body }, returnDocument: "after" }
               );
               return Ok(res, `${updatedProgram.label} is uploaded`);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async DeleteProgramById(req: Request, res: Response) {
          try {
               const programId = req.params.programId;
               const deletedProgram = await Program.findByIdAndDelete({ _id: programId }, { returnDocument: "after" });
               return Ok(res, `${deletedProgram.label} is deleted`);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
}
