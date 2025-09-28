import { FastifyInstance } from "fastify";
import v1Routes from "./v1/v1Routes";

export async function webModule(fastify: FastifyInstance) {
  // ✅ Registrar versión 1
  await fastify.register(v1Routes, { prefix: "/v1" });

  // ✅ Futuro: Registrar versión 2
  // await fastify.register(userRoutesV2, { prefix: "/v2" });

  // ✅ Alias para versión por defecto (opcional)
  //   await fastify.register(v1Routes, { prefix: "/latest" });
}
