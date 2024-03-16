import { Request, Response } from "express";
import { AdminRoute } from "../../../middleware";
import { AdminTypes, IController, IControllerRoutes, ILoginProps, INewAdminProps } from "../../../interface";
import {
     ADMIN_PREFIX,
     CheckPassword,
     GetJwtToken,
     HashPassword,
     Ok,
     SignJwtToken,
     UnAuthorized,
     VerifyJwtToken,
} from "../../../utils";
import { Admin } from "model";

export class AdminController implements IController {
     public routes: IControllerRoutes[] = [];
     constructor() {
          this.routes.push({
               handler: this.RegisterAdminAccount,
               path: `/${ADMIN_PREFIX}/sign-up`,
               method: "POST",
               // middleware: [AdminRoute],
          });
          this.routes.push({
               handler: this.LoginAdminAccount,
               method: "POST",
               path: `/${ADMIN_PREFIX}/sign-in`,
          });
          this.routes.push({
               handler: this.GetAllAdmins,
               method: "GET",
               path: `/${ADMIN_PREFIX}/admins`,
               // middleware: [AdminRoute],
          });
          this.routes.push({
               handler: this.GetAdminProfile,
               method: "GET",
               path: `/${ADMIN_PREFIX}/profile`,
               middleware: [AdminRoute],
          });
          this.routes.push({
               handler: this.LogoutAdminAccount,
               method: "POST",
               path: `/${ADMIN_PREFIX}/sign-out`,
               middleware: [AdminRoute],
          });
     }

     public async RegisterAdminAccount(req: Request, res: Response) {
          try {
               const { addressLine1, addressLine2, email, firstName, lastName, mobile, password }: INewAdminProps =
                    req.body;
               if (!addressLine1 || !addressLine2 || !email || !firstName || !lastName || !mobile || !password) {
                    return UnAuthorized(res, "missing credentials");
               }
               const admin = await Admin.findOne({ "contact.email": email });

               if (admin) {
                    return UnAuthorized(res, "email is already in use");
               }

               const newAdmin = await new Admin({
                    acType: AdminTypes.ADMIN,
                    auth: {
                         password: HashPassword(password),
                    },
                    contact: {
                         mobile: mobile,
                         email: email,
                         address: {
                              addressLine1,
                              addressLine2,
                         },
                    },
                    name: {
                         firstName,
                         lastName,
                    },
               }).save();

               return Ok(res, `${newAdmin.name.firstName} ${newAdmin.name.lastName} is registered`);
          } catch (err) {
               console.log(err);
               return UnAuthorized(res, err);
          }
     }

     public async LoginAdminAccount(req: Request, res: Response) {
          try {
               const { email, password }: ILoginProps = req.body;
               if (!email || !password) {
                    return UnAuthorized(res, "missing credentials");
               }

               const admin = await Admin.findOne({ "contact.email": email });

               if (!admin) {
                    return UnAuthorized(res, "no admin found with this email");
               }

               const checkPassword = CheckPassword({ hashed: admin.auth.password, password: password });

               if (!checkPassword) {
                    return UnAuthorized(res, "invalid credentials");
               }

               const token = SignJwtToken(admin._id);
               return Ok(res, {
                    token,
                    email: admin.contact.email,
               });
          } catch (err) {
               console.log(err);
               return UnAuthorized(res, err);
          }
     }

     public async GetAllAdmins(req: Request, res: Response) {
          try {
               const admin = await Admin.find();
               return Ok(res, admin);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async GetAdminProfile(req: Request, res: Response) {
          try {
               const token = GetJwtToken(req);
               const verified = VerifyJwtToken(token);
               const admin = await Admin.findById({ _id: verified.id });
               return Ok(res, admin);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async LogoutAdminAccount(req: Request, res: Response) {
          try {
               res.removeHeader("authorization");
               return Ok(res, "LOGGED_OUT");
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
}
