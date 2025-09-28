import mongoose, { Schema } from "mongoose";
import {
  AccountSchema,
  PublicProfileSchema,
  TokensSchema,
  MetaSchema,
} from "./schemas";
import { IUserDocument } from "./interfaces/UserDocument";

const UserSchema = new Schema<IUserDocument>(
  {
    account: {
      type: AccountSchema,
      default: () => ({}),
    },
    public_profile: {
      type: PublicProfileSchema,
      default: () => ({}),
    },
    activity_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "activities",
      },
    ],
    monthly_tracking_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "monthly_tracking",
      },
    ],
    habits_config: [
      {
        title: {
          type: String,
          required: true,
        },
      },
    ],
    tokens: {
      type: TokensSchema,
      default: () => ({
        access_tokens: [],
        context_tokens: [],
        refresh_tokens: [],
      }),
    },
    meta: {
      // Aqui irian cosas como ultimo inicio de sesion, usuario activo,
      type: MetaSchema,
      default: () => ({}),
    },
  },
  {
    collection: "users",
    timestamps: false,
  }
);

// TODO:
// {
//   "meta": {
//     "created_at": "2025-06-29T10:00:00Z",
//     "last_login_at": "2025-06-29T10:00:00Z",
//     "login_count": 1,                    // ← Si es 1 = primer login
//     "is_first_login": true,              // ← O flag explícito
//     "first_monthly_tracking_created": true  // ← Flag de que ya se creó MT
//   }
// }

UserSchema.index({ "account.email": 1 });
UserSchema.index({ "public_profile.username": 1 });
// UserSchema.index({ "account.account_status": 1 });
// UserSchema.index({ "meta.last_active_at": -1 });

// UserSchema.index({ "tokens.access_tokens.token_id": 1 });
// UserSchema.index({ "tokens.refresh_tokens.token_id": 1 });
// UserSchema.index({ "tokens.access_tokens.expires_at": 1 });
// UserSchema.index({ "tokens.refresh_tokens.expires_at": 1 });

UserSchema.pre("save", function (next) {
  if (this.isModified() && !this.isNew) {
    // this.meta.updated_at = new Date();
    this.set("meta.updated_at", new Date());
  }
  next();
});

UserSchema.pre(["updateOne", "findOneAndUpdate"], function (next) {
  this.set({ "meta.updated_at": new Date() });
  next();
});

UserSchema.methods.toPublicProfile = function () {
  return {
    id: this._id,
    username: this.public_profile.username,
    display_name: this.public_profile.display_name,
    bio: this.public_profile.bio,
    profile_picture_url: this.public_profile.followers_count,
    followers_count: this.public_profile.followers_count,
    following_count: this.public_profile.following_count,
  };
};

UserSchema.methods.toAuthResponse = function () {
  return {
    id: this._id,
    email: this.account.email,
    username: this.public_profile.username,
    display_name: this.public_profile.display_name,
    email_verified: this.account.email_verified,
    account_status: this.account.account_status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const UserModel = mongoose.model<IUserDocument>("User", UserSchema);
