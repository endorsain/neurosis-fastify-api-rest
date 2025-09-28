import mongoose, { Schema } from "mongoose";
import { MetaSchema, WeeklyProgrammingSchema } from "./schemas";

const ActivitySchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  title: {
    type: String,
    required: true,
  },
  // sub actividades ?
  weekly_programming: {
    type: WeeklyProgrammingSchema,
  },
  meta: {
    type: MetaSchema,
  },
});
