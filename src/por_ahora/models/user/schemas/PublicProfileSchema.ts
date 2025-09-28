import { Schema } from "mongoose";

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
