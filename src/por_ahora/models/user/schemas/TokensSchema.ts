import mongoose, { Schema } from "mongoose";
import {
  ITokensData,
  IAccessToken,
  IRefreshToken,
  IContextToken,
} from "../interfaces/TokensData";

const DeviceInfoSchema = new Schema(
  {
    user_agent: { type: String },
    ip_address: { type: String },
    device_name: { type: String },
  },
  { _id: false }
);

const AccessTokenSchema = new Schema<IAccessToken>(
  {
    token_id: {
      type: String,
      required: true,
      unique: true,
    },
    token_hash: {
      type: String,
      required: true,
    },
    token_type: {
      type: String,
      enum: ["access"],
      default: "access",
    },
    device_info: DeviceInfoSchema,
    created_at: {
      type: Date,
      default: Date.now,
    },
    expires_at: {
      type: Date,
      required: true,
    },
    last_used_at: { type: Date },
    is_revoked: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const ContextTokenSchema = new Schema<IContextToken>(
  {
    token_id: {
      type: String,
      required: true,
      unique: true,
    },
    token_hash: {
      type: String,
      required: true,
    },
    token_type: {
      type: String,
      enum: ["context"],
      default: "context",
    },
    dynamic_context: {
      current_month_tracking_id: {
        type: mongoose.Types.ObjectId,
        ref: "monthly_tracking",
      },
    },
    static_context: {
      user_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "user",
      },
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    expires_at: {
      type: Date,
      required: true,
    },
    is_revoked: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    token_id: {
      type: String,
      required: true,
      unique: true,
    },
    token_hash: {
      type: String,
      required: true,
    },
    token_type: {
      type: String,
      enum: ["refresh"],
      default: "refresh",
    },
    token_family: {
      type: String,
      required: true,
    },
    access_token_id: { type: String },
    device_info: DeviceInfoSchema,
    created_at: {
      type: Date,
      default: Date.now,
    },
    expires_at: {
      type: Date,
      required: true,
    },
    last_used_at: { type: Date },
    is_revoked: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

export const TokensSchema = new Schema<ITokensData>(
  {
    access_tokens: [AccessTokenSchema],
    context_tokens: [ContextTokenSchema],
    refresh_tokens: [RefreshTokenSchema],
    last_cleanup_at: { type: Date },
  },
  { _id: false }
);
