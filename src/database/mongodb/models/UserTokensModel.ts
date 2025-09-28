import mongoose, { Schema } from "mongoose";
import {
  AccessTokenSchema,
  RefreshTokenSchema,
} from "../schemas/UserTokensSchema";

const UserTokensSchema = new Schema(
  {
    user: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
        unique: true,
        index: true,
      },
      username: {
        type: String,
        required: true,
        ref: "user",
        unique: true,
        index: true,
      },
    },
    access_tokens: {
      type: [AccessTokenSchema],
      default: [],
    },
    refresh_tokens: {
      type: [RefreshTokenSchema],
      default: [],
    },
    last_cleanup_at: {
      type: Date,
      default: null,
    },
  },
  {
    collection: "user_tokens",
    timestamps: false,
  }
);

export const UserTokensModel = mongoose.model(
  "UserTokens",
  UserTokensSchema,
  "user_tokens"
);
