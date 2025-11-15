import fastifyCors from "@fastify/cors";

export const corsPlugin = async (fastify: any) => {
  await fastify.register(fastifyCors, {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "https://neurosis.vercel.app",
    ],
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
