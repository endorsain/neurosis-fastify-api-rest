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
    roles: {
      type: [String],
      enum: ["user", "admin", "moderator"],
      default: ["user"],
    },
  },
  {
    _id: false,
  }
);

export const PublicProfileSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    display_name: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    profile_picture_url: {
      type: String,
    },
    followers_count: {
      type: Number,
    },
    following_count: {
      type: Number,
    },
  },
  {
    _id: false,
  }
);

export const MetaSchema = new Schema(
  {
    last_login_at: {
      type: Date,
    },
    last_active_at: {
      type: Date,
    },
    login_count: {
      type: Number,
      default: 0,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
    timestamps: false,
  }
);
