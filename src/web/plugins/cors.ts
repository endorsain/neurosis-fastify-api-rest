import fastifyCors from "@fastify/cors";

export const corsPlugin = async (fastify: any) => {
  // Lee la variable de entorno
  const originsEnv = process.env.ACCEPTED_ORIGINS || "";

  // Convierte string → array (maneja espacios por si acaso)
  const origins = originsEnv
    .split(",")
    .map((o) => o.trim())
    .filter((o) => o.length > 0);

  await fastify.register(fastifyCors, {
    origin: (origin: any, cb: any) => {
      // Requests sin origin (como mobile apps o server-side) → permitir
      if (!origin) return cb(null, true);

      // Validar si el origin está en la lista
      if (origins.includes(origin)) {
        return cb(null, true);
      }

      // Bloquear si no está permitido
      cb(new Error("Origin not allowed by CORS"), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Cache-Control",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false,
  });
};
