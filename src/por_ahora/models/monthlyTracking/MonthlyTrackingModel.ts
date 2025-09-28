import mongoose, { Schema } from "mongoose";
import { MetaSchema, DaysTrackingSchema } from "./schemas";

export const MonthlyTrackingSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  // calendario test
  // podria marcar los dias que hizo al menos una actividad
  calendar: [
    {
      day: {
        type: Number,
      },
      // info general
    },
  ],
  days_tracking: [DaysTrackingSchema],
  meta: {
    // day, month
    type: MetaSchema,
  },
});
