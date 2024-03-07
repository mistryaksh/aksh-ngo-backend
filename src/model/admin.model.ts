import { AdminTypes, IAdminProps } from "interface";
import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema<IAdminProps>(
     {
          name: {
               firstName: { type: mongoose.Schema.Types.String, required: true },
               lastName: { type: mongoose.Schema.Types.String, required: true },
          },
          auth: {
               password: { type: mongoose.Schema.Types.String, required: true },
               changedOn: { type: mongoose.Schema.Types.String },
          },
          contact: {
               email: { type: mongoose.Schema.Types.String, required: true },
               mobile: { type: mongoose.Schema.Types.String, required: true },
               address: {
                    addressLine1: { type: mongoose.Schema.Types.String, required: true },
                    addressLine2: { type: mongoose.Schema.Types.String, required: true },
               },
          },
          acType: { type: mongoose.Schema.Types.String, default: AdminTypes, required: true },
     },
     {
          timestamps: true,
     }
);

export const Admin = mongoose.model<IAdminProps>("Admin", AdminSchema);
