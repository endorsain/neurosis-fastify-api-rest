import { Schema } from "mongoose";

const ActivityTracking = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

export const DaysTrackingSchema = new Schema(
  {
    day: {
      type: Number,
      required: true,
    },
    activity_tracking: [ActivityTracking],
    focus_time: {
      type: Number,
      required: true,
    },
    unknown_time: {
      type: Number,
      required: true,
    },
    total_time: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);
