import mongoose, { Schema } from "mongoose";

export const DeviceInfoSchema = new Schema(
  {
    // Información técnica detallada
    user_agent: {
      type: String,
      required: true,
    },
    ip_address: {
      type: String,
      required: true,
    },
    // Información parseada del dispositivo
    device_type: {
      type: String,
      enum: ["mobile", "tablet", "desktop", "unknown"],
      required: true,
    },
    // Información del navegador
    browser: {
      name: { type: String, required: true }, // 'Chrome'
      version: { type: String, required: true }, // '120.0.0.0'
      // full_version: { type: String }, // 'Chrome 120.0.0.0'
    },
    // Información del sistema operativo
    os: {
      name: { type: String, required: true }, // 'Windows'
      version: { type: String, required: true }, // '10/11'
      // full_name: { type: String }, // 'Windows 10/11'
    },
  },
  {
    _id: false,
    timestamps: false,
  }
);

export const AccessTokenSchema = new Schema(
  {
    token_id: {
      type: String,
      required: true,
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

export const RefreshTokenSchema = new Schema(
  {
    token_id: {
      type: String,
      required: true,
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
