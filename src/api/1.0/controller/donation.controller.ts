import { Request, Response } from "express";
import { AdminRoute } from "../../../middleware";
import {
     DonationInitialProps,
     IController,
     IControllerRoutes,
     IDonationProps,
     PhonePeRedirectMode,
     PhonePeRequestedBody,
     SendMailProps,
} from "../../../interface";
import axios from "axios";
import { DONATIONS_PREFIX, MailService, Ok, UnAuthorized } from "../../../utils";
import crypto, { randomUUID } from "crypto";
import { Donation } from "model";

export class DonationController implements IController {
     public routes: IControllerRoutes[] = [];
     constructor() {
          this.routes.push({
               handler: this.PayDonation,
               path: "/donation/pay",
               method: "POST",
          });
          this.routes.push({
               handler: this.CheckDonationStatus,
               path: "/donation/check-status",
               method: "POST",
          });
          this.routes.push({
               handler: this.GetAllDonations,
               method: "GET",
               path: "/donation/all",
               middleware: [AdminRoute],
          });
          this.routes.push({ handler: this.GetDonationById, method: "GET", path: `/${DONATIONS_PREFIX}/:donationId` });

          this.routes.push({ handler: this.SendMailToDonator, method: "POST", path: `/${DONATIONS_PREFIX}/send-mail` });
          this.routes.push({
               handler: this.ManualEntryForDonation,
               method: "POST",
               path: "/donation/manual",
               middleware: [AdminRoute],
          });
     }

     public async PayDonation(req: Request, res: Response) {
          try {
            const {
              amount,
              email,
              mobile,
              userName,
              userId,
            }: DonationInitialProps = req.body;
            if (!amount || !email || !mobile || !userName) {
              return UnAuthorized(res, "missing credentials");
            }
            const data: PhonePeRequestedBody = {
              merchantId: "PGTESTPAYUAT",
              merchantTransactionId: "MT7850590068188104",
              merchantUserId: "MUID" + userId,
              name: userName,
              amount: amount * 100,
              // !Change call here
              redirectUrl: `https://ngo-demo.aksh.ltd/donation/status/MT7850590068188104`,
              redirectMode: PhonePeRedirectMode.REDIRECT,
              mobileNumber: mobile,
              paymentInstrument: {
                type: "PAY_PAGE",
              },
            };
            const payload = JSON.stringify(data);
            const payloadMain =
              "ewogICJtZXJjaGFudElkIjogIlBHVEVTVFBBWVVBVCIsCiAgIm1lcmNoYW50VHJhbnNhY3Rpb25JZCI6ICJNVDc4NTA1OTAwNjgxODgxMDQiLAogICJtZXJjaGFudFVzZXJJZCI6ICJNVUlEMTIzIiwKICAiYW1vdW50IjogMTAwMDAsCiAgInJlZGlyZWN0VXJsIjogImh0dHBzOi8vd2ViaG9vay5zaXRlL3JlZGlyZWN0LXVybCIsCiAgInJlZGlyZWN0TW9kZSI6ICJSRURJUkVDVCIsCiAgImNhbGxiYWNrVXJsIjogImh0dHBzOi8vd2ViaG9vay5zaXRlL2NhbGxiYWNrLXVybCIsCiAgIm1vYmlsZU51bWJlciI6ICI5OTk5OTk5OTk5IiwKICAicGF5bWVudEluc3RydW1lbnQiOiB7CiAgICAidHlwZSI6ICJQQVlfUEFHRSIKICB9Cn0=";
            const keyIndex = 1;
            const string =
              payloadMain + "/pg/v1/pay" + process.env.PHONE_PE_API_KEY;
            const sha256 = crypto
              .createHash("sha256")
              .update(string)
              .digest("hex");
            const checksum =
              "d7a8e4458caa6fcd781166bbdc85fec76740c18cb9baa9a4c48cf2387d554180###1";
            const prod_URL =
              "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

            const newDonation = await new Donation({
              userId: userId,
              amount: amount,
              custName: userName,
              email: email,
              mobile: mobile,
              referenceId: "MT7850590068188104",
              paymentToken: checksum,
              status: "INITIATED",
            }).save();
            const axiosResponse = await axios.post(
              prod_URL,
              {
                request: payloadMain,
              },
              {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  "X-VERIFY": checksum,
                },
              }
            );
            return Ok(
              res,
              await axiosResponse.data.data.instrumentResponse.redirectInfo
            );
          } catch (err) {
            console.log(err.response.data);
            return UnAuthorized(res, err as string);
          }
     }

     public async CheckDonationStatus(req: Request, res: Response) {
          try {
               const merchantTransactionId = req.body.transactionId;
               if (!merchantTransactionId) {
                    return UnAuthorized(res, "please provide transaction id");
               }
               const merchantId = "PGTESTPAYUAT";
               // const keyIndex = 1;
               const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + process.env.PHONE_PE_API_KEY;
               // const sha256 = crypto.createHash("sha256").update(string).digest("hex");
               const checksum = "d7a8e4458caa6fcd781166bbdc85fec76740c18cb9baa9a4c48cf2387d554180###1               ";
               const options = {
                    method: "GET",
                    url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
                    headers: {
                         accept: "application/json",
                         "Content-Type": "application/json",
                         "X-VERIFY": checksum,
                         "X-MERCHANT-ID": `${merchantId}`,
                    },
               };
               const axiosResponse = await axios.get(options.url, {
                    headers: options.headers,
               });
               if ((await axiosResponse.data.data.responseCode) === "SUCCESS") {
                    const donation = await Donation.findOneAndUpdate(
                         { referenceId: merchantTransactionId },
                         {
                              $set: {
                                   status: "SUCCESS",
                              },
                         }
                    );
                    const sentMailResponse = MailService.sendMail(
                         {
                              from: "mistryaksh1998@gmail.com",
                              to: donation.email,
                              subject: `Gratitude for Your Compassionate Support`,
                              html: `

                              Dear  ${donation.custName},

                              I hope this message finds you well and filled with the same warmth and kindness you've extended to us through your recent donation to [NGO Name]. Your generosity shines as a beacon of hope, lighting the path for those we serve, and we are truly grateful.

                              Your donation will be instrumental in furthering our mission to [briefly describe the NGO's mission and activities, e.g., providing education to underprivileged children, offering healthcare services to remote communities, advocating for environmental conservation, etc.]. Your support allows us to continue our work with renewed vigor and dedication.

                              It's humbling to see individuals like you who recognize the importance of our cause and step forward to make a difference. Your contribution not only provides financial support but also serves as a source of inspiration for our team and the communities we serve.

                              Please accept our heartfelt thanks for your generosity and compassion. Your donation will have a lasting impact on the lives of many, empowering them to build brighter futures for themselves and their communities.

                              We are honored to have you as part of our journey towards positive change. Together, we can create a world where everyone has the opportunity to thrive.

                              With sincerest gratitude,

                             YOU NGO SENDER NAME
                              NGO AUTO BOT
                              YOUR NGO NAME
                              +91 8669026894
                              `,
                         },
                         (error, response) => {
                              if (error) {
                                   console.log("error", error);
                                   return UnAuthorized(res, error.message);
                              } else {
                                   return Ok(res, "MAIL_SENT");
                              }
                         }
                    );
                    const updatedDonation = await Donation.findById({ _id: donation._id });
                    return Ok(res, updatedDonation);
               } else {
                    const updatedDonation = await Donation.findOneAndUpdate(
                         { referenceId: merchantTransactionId },
                         {
                              $set: {
                                   status: "FAILED",
                              },
                         }
                    );
                    return UnAuthorized(res, {
                         message: `payment failed with ${await axiosResponse.data.data.responseCode}`,
                         message2: `${updatedDonation.custName} your transaction has been failed`,
                    });
               }
          } catch (err) {
               console.log(err);
               return UnAuthorized(res, err);
          }
     }

     public async GetAllDonations(req: Request, res: Response) {
          try {
               const donations = await Donation.find().sort({ createdAt: -1 });
               return Ok(res, donations);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
     public async GetDonationById(req: Request, res: Response) {
          try {
               const { donationId } = req.params;
               const donation = await Donation.findById({ _id: donationId });
               return Ok(res, donation);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }

     public async SendMailToDonator(req: Request, res: Response) {
          try {
               const { donatorMailId, fileLink, subject }: SendMailProps = req.body;
               console.log(req.body);
               if (!fileLink || !donatorMailId || !subject) {
                    return UnAuthorized(res, "missing fields");
               }
               const sentMailResponse = MailService.sendMail(
                    {
                         from: "mistryaksh1998@gmail.com",
                         to: donatorMailId,
                         subject: `COLLECT YOUR 80G CERTIFICATE`,
                         html: `
                         ${subject}
                         Hi there! 😍
                         <h1>Thank you for donation on om shanti welfare trust</h1>
                         <p>
                              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque culpa sint sed facilis suscipit, aut repellat consequuntur aperiam. Obcaecati, voluptatem.
                         </p>
                         <p>Here is your official 80G certification from our NGO</p>
                         80G Link - <a href=${fileLink}>Save to device</a>
                         `,
                    },
                    (error, response) => {
                         if (error) {
                              console.log("error", error);
                              return UnAuthorized(res, error.message);
                         } else {
                              return Ok(res, "MAIL_SENT");
                         }
                    }
               );
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
     public async ManualEntryForDonation(req: Request, res: Response) {
          try {
               const { amount, email, mobile, custName, paymentToken, referenceId }: IDonationProps = req.body;
               if (!amount || !email || !mobile || !custName || !referenceId) {
                    return UnAuthorized(res, "missing credentials");
               }
               const newDonation = await new Donation({
                    amount,
                    custName: custName,
                    email,
                    mobile,
                    paymentToken: paymentToken,
                    status: "COMPLETED",
                    userId: randomUUID(),
                    referenceId,
               }).save();
               return Ok(res, `${custName} is saved as donation!`);
          } catch (err) {
               return UnAuthorized(res, err);
          }
     }
}
