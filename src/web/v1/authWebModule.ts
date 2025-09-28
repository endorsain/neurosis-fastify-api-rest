import { FastifyInstance } from "fastify";
import { UserMongoRepository } from "../../database/mongodb/repository/UserMongoRepository";
import { AuthService } from "../../auth/application/AuthService";
import { AuthController } from "../../auth/infrastructure/AuthController";
import { userTokensMongoRepository } from "../../database/mongodb/repository/UserTokensRepository";
import { TokenService } from "../../services/TokenService";
import { TOKENS_CONFIG } from "../../config/tokens";

export async function authWebModule(fastify: FastifyInstance) {
  const userRepository = new UserMongoRepository();
  const userTokensRepository = new userTokensMongoRepository();

  const tokenService = new TokenService(TOKENS_CONFIG);
  const authService = new AuthService(userRepository, userTokensRepository);

  const authController = new AuthController(authService, tokenService);

  fastify.post("/register", authController.registerUser.bind(authController));
  fastify.post("/login", authController.loginUser.bind(authController));
  fastify.post(
    "/access-with-google",
    authController.accessWithGoogleUser.bind(authController)
  );
}
