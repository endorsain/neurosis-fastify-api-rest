import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../application/AuthService";
import { TokenService } from "../../services/TokenService";
import { TOKENS_CONFIG } from "../../config/tokens";

export class AuthController {
  private authService: AuthService;
  private tokenService: TokenService;

  constructor(authService: AuthService, tokenService: TokenService) {
    this.authService = authService;
    this.tokenService = tokenService;
  }

  async registerUser(
    request: FastifyRequest<{
      Body: {
        email: string;
        username: string;
        password: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { email, username, password } = request.body;

      await this.authService.registerUserUseCase({
        email,
        username,
        password,
      });

      reply.code(201).send({
        message: "Registro exitoso",
      });
    } catch (error: any) {
      request.log.error("AuthController - registerUserUseCase: ", error);
      throw error;
    }
  }

  async loginUser(
    request: FastifyRequest<{
      Body: {
        credential: string;
        password: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const deviceInfo = request.deviceInfo;
      const { credential, password } = request.body;

      const result = await this.authService.loginUserUseCase(
        credential,
        password,
        deviceInfo
      );

      // this.setTokenCookies(reply, loginResult.tokens);
      this.tokenService.setTokenCookie(
        reply,
        result.accessToken,
        TOKENS_CONFIG.access
      );
      this.tokenService.setTokenCookie(
        reply,
        result.refreshToken,
        TOKENS_CONFIG.refresh
      );

      reply.code(201).send({
        message: "Inicio de sesion exitoso.",
      });
    } catch (error: any) {
      request.log.error("AuthController - loginUserUseCase: ", error);
      throw error;
    }
  }

  async accessWithGoogleUser(
    request: FastifyRequest<{ Body: { googleCredential: string } }>,
    reply: FastifyReply
  ) {
    try {
      console.log("🔐 Iniciando login con Google...");

      // Extraer device info del middleware
      const deviceInfo = request.deviceInfo;
      const { googleCredential } = request.body;

      // Ejecutar caso de uso
      const result = await this.authService.accessWithGoogleUseCase(
        googleCredential,
        deviceInfo
      );

      this.tokenService.setTokenCookie(
        reply,
        result.accessToken,
        TOKENS_CONFIG.access
      );
      this.tokenService.setTokenCookie(
        reply,
        result.refreshToken,
        TOKENS_CONFIG.refresh
      );

      // Responder con éxito
      reply.code(200).send({
        message: "Login con Google exitoso",
      });
    } catch (error: any) {
      request.log.error("AuthController - accessWithGoogleUser: ", error);
      throw error;
    }
  }

  // async logout(request: FastifyRequest, reply: FastifyReply) {
  //   try {
  //     // Limpiar todas las cookies
  //     reply.clearCookie("access_token");
  //     reply.clearCookie("refresh_token");

  //     reply.code(200).send({
  //       success: true,
  //       message: "Sesión cerrada exitosamente",
  //     });
  //   } catch (error) {
  //     reply.code(500).send({
  //       success: false,
  //       message: "Error al cerrar sesión",
  //     });
  //   }
  // }
}
