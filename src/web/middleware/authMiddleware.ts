import { FastifyReply, FastifyRequest } from "fastify";
import { TOKENS_CONFIG } from "../../config/tokens";
import jwt from "jsonwebtoken";
import { AuthMiddError } from "../../errors/AuthMiddError";

declare module "fastify" {
  interface FastifyRequest {
    accessTokenData?: {
      userId: string;
      username?: string;
      email?: string;
      roles?: string[];
    };
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const accessToken: any = request.cookies[TOKENS_CONFIG.access.cookieName];
    const refreshToken = request.cookies[TOKENS_CONFIG.refresh.cookieName];

    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

    if (!refreshToken) throw AuthMiddError.refreshTokenMissing();

    const decoded = jwt.verify(
      accessToken,
      TOKENS_CONFIG.access.secret
    ) as jwt.JwtPayload;

    // Extraer datos relevantes
    request.accessTokenData = {
      userId: decoded.sub as string,
      username: decoded.username as string,
      email: decoded.email as string,
      roles: decoded.roles as string[],
    };
  } catch (error: any) {
    throw AuthMiddError.wrap(error);
  }
}
