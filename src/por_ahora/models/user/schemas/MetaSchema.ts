import { Schema } from "mongoose";

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
