import { Schema } from "mongoose";

export const AccountSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    account_status: {
      type: String,
      enum: ["active", "suspended", "pending_verification"],
      default: "pending_verification",
    },
  },
  {
    _id: false,
  }
);
