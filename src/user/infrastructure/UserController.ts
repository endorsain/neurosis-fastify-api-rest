import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../application/UserService";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async getInfo(request: FastifyRequest, reply: FastifyReply) {
    try {
      console.log("JEJEJE: ");
      const tokenData = request.accessTokenData;

      const user = await this.userService.getInfoUseCase(tokenData);

      console.log("JEJEJE: ", user);

      reply.code(200).send({
        user,
      });
    } catch (error) {
      console.log("UserController - getInfo: ", error);
      throw error;
    }
  }
}
