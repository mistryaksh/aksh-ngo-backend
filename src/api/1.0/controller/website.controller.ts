import { Request, Response } from "express";
import { AdminRoute } from "../../../middleware";
import {
     IController,
     IControllerRoutes,
     IDonationConfigProps,
     INgoProfileProps,
     IUserContactProps,
} from "../../../interface";
import { NGO_PROFILE, Ok, USER_CONTACT, USER_DONATION_CONFIG, UnAuthorized } from "../../../utils";
import { Admin, Blog, Donation, DonationConfig, Event, NgoProfile, Program, UserContact } from "model";

export class WebsiteController implements IController {
     public routes: IControllerRoutes[] = [];
     constructor() {
          this.routes.push({
               handler: this.NewUserContact,
               path: `/${USER_CONTACT}/new`,
               method: "POST",
          });
          this.routes.push({
               handler: this.GetNgoProfile,
               method: "GET",
               path: `/${NGO_PROFILE}`,
          });
          this.routes.push({
               handler: this.GetAllUserContact,
               path: `/${USER_CONTACT}/all`,
               method: "GET",
          });
          this.routes.push({
               handler: this.GetNgoProfileById,
               method: "GET",
               path: `/${NGO_PROFILE}/:ngoProfileId`,
          });
          this.routes.push({
               handler: this.GetAllUserContact,
               path: `/${USER_CONTACT}/:contactId`,
               method: "GET",
          });
          this.routes.push({
               handler: this.NewDonationRecords,
               method: "POST",
               path: `/${USER_DONATION_CONFIG}`,
               middleware: [AdminRoute],
          });
          this.routes.push({
               handler: this.GetAllUserContact,
               method: "GET",
               path: `/${USER_DONATION_CONFIG}`,
               middleware: [AdminRoute],
          });
          this.routes.push({
               handler: this.DonationConfigs,
               method: "GET",
               path: `/${USER_DONATION_CONFIG}`,
               middleware: [AdminRoute],
          });
          this.routes.push({
               handler: this.DonationConfigById,
               method: "GET",
               path: `/${USER_DONATION_CONFIG}/:donationConfigId`,
          });
          this.routes.push({
               handler: this.NewNgoProfile,
               method: "POST",
               path: `/${NGO_PROFILE}`,
               middleware: [AdminRoute],
          });
          this.routes.push({
               handler: this.DataAnalyser,
               method: "GET",
               path: `/${NGO_PROFILE}/database/data-analyser`,
               middleware: [AdminRoute],
          });
     }

     public async NewUserContact(req: Request, res: Response) {
          try {
               const { email, fullName, message, subject }: IUserContactProps = req.body;

               if (!email || !fullName || !message) {
                    return UnAuthorized(res, "missing fields");
               }

               const newUserContact = await new UserContact({
                    email,
                    fullName,
                    message,
                    subject,
               }).save();
               return Ok(res, `${newUserContact.fullName} your message has been received`);
          } catch (err) {
               return UnAuthorized(res, err as string);
          }
     }

     public async GetAllUserContact(req: Request, res: Response) {
          try {
               const contacts = await UserContact.find().sort({ createdAt: -1 });
               return Ok(res, contacts);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async GetContactById(req: Request, res: Response) {
          try {
               const contactId = req.params.contactId;
               const contact = await UserContact.findById({ _id: contactId });
               return Ok(res, contact);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async NewDonationRecords(req: Request, res: Response) {
          try {
               const { key_id, key_secret, minimumDonation }: IDonationConfigProps = req.body;

               if (!key_id || !key_secret || !minimumDonation) {
                    return UnAuthorized(res, "missing fields");
               }

               const newDonationRecords = await new DonationConfig({
                    key_id,
                    key_secret,
                    minimumDonation,
               }).save();
               return Ok(res, `${newDonationRecords.minimumDonation} is created`);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async DonationConfigs(req: Request, res: Response) {
          try {
               const donationConfigs = await DonationConfig.find().sort({ createdAt: -1 });
               return Ok(res, donationConfigs);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async DonationConfigById(req: Request, res: Response) {
          try {
               const donationConfigId = req.params.donationConfigId;
               const donationConfig = await DonationConfig.findById({ _id: donationConfigId });
               return Ok(res, donationConfig);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async GetNgoProfile(req: Request, res: Response) {
          try {
               const ngoProfile = await NgoProfile.find().limit(1);
               return Ok(res, ngoProfile);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async GetNgoProfileById(req: Request, res: Response) {
          try {
               const ngoProfileId = req.params.ngoProfileId;
               const ngoProfile = await NgoProfile.findById({ _id: ngoProfileId });
               return Ok(res, ngoProfile);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async NewNgoProfile(req: Request, res: Response) {
          try {
               const { description, mission, vision }: INgoProfileProps = req.body;
               const newNgoProfile = await new NgoProfile({
                    description,
                    mission,
                    vision,
               }).save();
               return Ok(res, `${newNgoProfile} is created`);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async DataAnalyser(req: Request, res: Response) {
          try {
               const blogs = (await Blog.find()).length;
               const program = (await Program.find()).length;
               const event = (await Event.find()).length;
               const donations = (await Donation.find()).length;
               return Ok(res, {
                    blogs,
                    program,
                    event,
                    donations,
               });
          } catch (err) {
               console.log(err);
               return UnAuthorized(res, err);
          }
     }
}
