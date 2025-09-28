import mongoose, { Document } from "mongoose";
import { ITokensData } from "./TokensData";

interface IAccountData {
  email: string;
  password: string;
  email_verified: boolean;
  account_status: "active" | "suspended" | "pending_verification";
}

interface IMetaData {
  last_login_at?: Date;
  last_active_at?: Date;
  login_count: number;
  signup_ip?: string;
  created_at: Date;
  updated_at: Date;
}

interface IPublicProfile {
  username: string;
  display_name: string;
  bio: string;
  profile_picture_url: string;
  followers_count: number;
  following_count: number;
}

interface IHabitsConfig {
  title: string;
  //   habit_id?: string;
  //   habit_type?: "build" | "break" | "maintain";
  //   category?: string;
  //   is_active?: boolean;
  //   created_at?: Date;
}

export interface IUserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  account: IAccountData;
  public_profile: IPublicProfile;
  activity_ids: mongoose.Types.ObjectId[];
  monthly_tracking_ids: mongoose.Types.ObjectId[];
  habits_config: IHabitsConfig[];
  tokens: ITokensData;
  meta: IMetaData;
}
