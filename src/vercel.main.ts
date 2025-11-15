import Fastify from "fastify";
import { corsPlugin } from "./web/plugins/cors";
import fastifyCookie from "@fastify/cookie";
import mongoose from "mongoose";
import { addDeviceInfoMiddleware } from "./web/middleware";
import { errorHandler } from "./web/handlers/errorHandler";
import { webModule } from "./web/webModule";

export async function buildServer() {
  const fastify = Fastify({ logger: { level: "info" } });

  await corsPlugin(fastify);
  await fastify.register(fastifyCookie);

  const mongoUri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/neurosis";
  await mongoose.connect(mongoUri);

  console.log("antes de deviceInfo");
  fastify.addHook("preHandler", addDeviceInfoMiddleware);
  console.log("paso deviceInfo");
  fastify.setErrorHandler(errorHandler);
  console.log("paso errorHandler");
  await fastify.register(webModule);
  console.log("paso webModule");

  return fastify;
}
