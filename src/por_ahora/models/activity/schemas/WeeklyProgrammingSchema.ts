import { Schema } from "mongoose";

const WeekSchema = new Schema({
  // inicio de dia,
  start_day: {
    type: Number,
  },
  // inicio de hora del dia
  start_time: {
    type: Number,
  },
  // fin del dia
  end_day: {
    type: Number,
  },
  // fin de hora del dia
  end_time: {
    type: Number,
  },
});

export const WeeklyProgrammingSchema = new Schema(
  {
    // Fecha de cuando termina la configuaracion de la semana
    deadline: {
      type: Date,
      required: false,
    },
    week: [WeekSchema],
  },
  { _id: false }
);
