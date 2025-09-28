import { FastifyInstance } from "fastify";
import { UserMongoRepository } from "../../database/mongodb/repository/UserMongoRepository";
import { UserService } from "../../user/application/UserService";
import { UserController } from "../../user/infrastructure/UserController";
import { authMiddleware } from "../middleware";

export async function userWebModule(fastify: FastifyInstance) {
  const userRepository = new UserMongoRepository();
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  fastify.addHook("preHandler", authMiddleware);

  fastify.get("/get-info", userController.getInfo.bind(userController));
}
