import { FastifyInstance } from "fastify";
import { authWebModule } from "./authWebModule";
import { userWebModule } from "./userWebModule";

export default async function v1Routes(fastify: FastifyInstance) {
  await fastify.register(authWebModule, { prefix: "/auth" });

  await fastify.register(userWebModule, { prefix: "/user" });
}
