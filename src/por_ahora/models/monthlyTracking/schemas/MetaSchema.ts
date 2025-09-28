import { Schema } from "mongoose";

export const MetaSchema = new Schema(
  {
    updated_at: {
      type: Date,
    },
    created_at: {
      type: Date,
    },
  },
  {
    _id: false,
  }
);
