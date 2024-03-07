import nodemailer from "nodemailer";

export const ADMIN_PREFIX: string = "admin";
export const ADMIN_EVENTS_CATEGORY: string = "category";
export const ADMIN_EVENTS: string = "events";
export const ADMIN_PROGRAM: string = "program";
export const ADMIN_CONTACT: string = "contact";
export const USER_CONTACT: string = "user";
export const USER_DONATION_CONFIG: string = "donation/config";
export const NGO_PROFILE: string = "ngo";
export const BLOG_PREFIX: string = "blogs";
export const DONATIONS_PREFIX: string = "donations";
export const GALLERY_PREFIX: string = "gallery";
export var MailService = nodemailer.createTransport({
     service: "gmail",
     auth: {
          user: "mistryaksh1998@gmail.com",
          pass: "gssjaockxlkhtauj",
     },
});
