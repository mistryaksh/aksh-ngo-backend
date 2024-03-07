import { Request, Response } from "express";
import crypto from "crypto";
import axios from "axios";
import { Ok, UnAuthorized } from "utils";

export const newPayment = async (req: Request, res: Response) => {
     try {
          const merchantTransactionId = "M" + Date.now();
          const { user_id, price, phone, name } = req.body;
          const data = {
               merchantId: "M2213IM0EERH2",
               merchantTransactionId: merchantTransactionId,
               merchantUserId: "MUID" + user_id,
               name: name,
               amount: price * 100,
               redirectUrl: `http://localhost:3001/api/v1/status/${merchantTransactionId}`,
               redirectMode: "POST",
               mobileNumber: phone,
               paymentInstrument: {
                    type: "PAY_PAGE",
               },
          };
          const payload = JSON.stringify(data);
          const payloadMain = Buffer.from(payload).toString("base64");
          const keyIndex = 2;
          const string = payloadMain + "/pg/v1/pay" + "849ea54b-fad3-4367-b99f-d2d404d0b111";
          const sha256 = crypto.createHash("sha256").update(string).digest("hex");
          const checksum = sha256 + "###" + keyIndex;
          const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
          const options = {
               method: "POST",
               url: prod_URL,
               headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                    "X-VERIFY": checksum,
               },
               data: {
                    request: payloadMain,
               },
          };
          await axios
               .request(options)
               .then(function (response) {
                    console.log(response.data.data.instrumentResponse.redirectInfo.url);
                    return Ok(res, response.data);
                    // return res.redirect(response.data.data.instrumentResponse.redirectInfo.url);
               })
               .catch(function (error) {
                    return UnAuthorized(res, error);
               });
     } catch (error) {
          return UnAuthorized(res, error);
     }
};
export const checkStatus = async (req: Request, res: Response) => {
     const merchantTransactionId = req.params["txnId"];
     const merchantId = process.env.MERCHANT_ID;
     const keyIndex = 2;
     const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + "849ea54b-fad3-4367-b99f-d2d404d0b111";
     const sha256 = crypto.createHash("sha256").update(string).digest("hex");
     const checksum = sha256 + "###" + keyIndex;
     const options = {
          method: "GET",
          url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
          headers: {
               accept: "application/json",
               "Content-Type": "application/json",
               "X-VERIFY": checksum,
               "X-MERCHANT-ID": `${merchantId}`,
          },
     };
     // CHECK PAYMENT STATUS
     axios.request(options)
          .then(async (response) => {
               if (response.data.success === true) {
                    console.log(response.data);
                    return res.status(200).send({ success: true, message: "Payment Success" });
               } else {
                    return res.status(400).send({ success: false, message: "Payment Failure" });
               }
          })
          .catch((err) => {
               console.error(err);
               res.status(500).send({ msg: err.message });
          });
};
