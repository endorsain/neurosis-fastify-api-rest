import { Schema } from "mongoose";

export const MetaSchema = new Schema(
  {
    is_active: {
      type: Boolean,
      default: false,
      required: true,
    },
    created_at: {
      type: Date,
      required: true,
    },
    updated_at: {
      type: Date,
      required: true,
    },
  },
  {
    _id: false,
  }
);
