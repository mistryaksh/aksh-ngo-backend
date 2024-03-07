import { Request, Response } from "express";
import {} from "../../../middleware";
import { IController, IControllerRoutes } from "../../../interface";

import { Ok, UnAuthorized } from "../../../utils";

export class ApiController implements IController {
     public routes: IControllerRoutes[] = [];
     constructor() {
          this.routes.push({
               handler: this.Homepage,
               path: "/",
               method: "GET",
          });
     }

     public async Homepage(req: Request, res: Response) {
          try {
               const data = "Hello api is responding";
               return Ok(res, data);
          } catch (err) {
               return UnAuthorized(res, err as string);
          }
     }
}
