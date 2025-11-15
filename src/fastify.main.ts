import Fastify from "fastify";
import cookie from "@fastify/cookie";
import mongoose from "mongoose";
import "dotenv/config";
import { webModule } from "./web/webModule";
import { errorHandler } from "./web/handlers/errorHandler";
import { corsPlugin } from "./web/plugins/cors";
import { addDeviceInfoMiddleware } from "./web/middleware";

async function bootstrap() {
  const fastify = Fastify({
    logger: {
      level: "info",
    },
  });
  try {
    await corsPlugin(fastify);
    console.log("✅ CORS configurado correctamente");
    await fastify.register(cookie);

    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/neurosis";

    await mongoose.connect(mongoUri);
    console.log("✅ Conectado a MongoDB");

    fastify.addHook("preHandler", addDeviceInfoMiddleware);

    fastify.setErrorHandler(errorHandler);
    await fastify.register(webModule);

    // ✅ Graceful shutdown
    process.on("SIGTERM", async () => {
      await fastify.close();
      await mongoose.disconnect();
      process.exit(0);
    });

    // ✅ Iniciar servidor
    const port = Number(process.env.PORT) || 3000;
    await fastify.listen({ port, host: "0.0.0.0" });

    console.log(`🚀 Servidor corriendo en puerto ${port}`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

bootstrap();
