import { Schema } from "mongoose";

export interface IDonationConfigProps {
     key_id: string;
     key_secret: string;
     minimumDonation: string;
     active?: boolean;
}

export interface DonationInitialProps {
     amount: number;
     userName: string;
     email: string;
     mobile: string;
     userId: string;
}

export interface IDonationProps {
     userId: string;
     amount: number;
     custName: string;
     email: string;
     mobile: string;
     referenceId: string;
     paymentToken: string;
     status: DonationStatus;
     donatedFor?: Schema.Types.ObjectId;
     dataId: string;
}

export type DonationStatus = "SUCCESS" | "REFUNDED" | "FAILED" | "CANCELLED" | "NOT_PERFORMED" | "INITIATED";

export interface SendMailProps {
     donatorMailId: string;
     subject: string;
     fileLink: string;
}

export enum PhonePeRedirectMode {
     "POST" = "POST",
     "REDIRECT" = "REDIRECT",
}

export interface PhonePeRequestedBody {
     merchantId: string;
     merchantTransactionId: string;
     merchantUserId: string;
     name: string;
     amount: number;
     redirectUrl: string;
     redirectMode: PhonePeRedirectMode;
     mobileNumber: string;
     paymentInstrument: {
          type: "PAY_PAGE";
     };
}
