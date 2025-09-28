import jwt from "jsonwebtoken";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { FastifyReply } from "fastify";
import { TokenCfg, TokensConfig } from "../config/tokens";

export class TokenService {
  constructor(private config: TokensConfig) {}

  generateTokenData(user: any, cfg: TokenCfg) {
    const payload: any = {
      userId: user.id,
      type: cfg.type,
    };

    if (cfg.type === "access") {
      payload.email = user.email;
      payload.username = user.username;
      payload.roles = user.roles;
      payload.emailVerified = user.email.emailVerified;
    }

    const token = jwt.sign(payload, cfg.secret, {
      issuer: this.config.issuer,
      algorithm: this.config.algorithm,
      expiresIn: cfg.durationSeconds,
      subject: user.id,
    });

    const tokenHash = crypto
      .createHash(this.config.tokenHashAlgo)
      .update(token)
      .digest("hex");

    const now = new Date();
    const expiresAt = new Date(now.getTime() + cfg.durationSeconds * 1000);

    // TODO: Talvez se deveria especifcar que los datos son para la base de datos.
    return {
      token,
      data: {
        token_id: uuidv4(),
        token_hash: tokenHash,
        token_type: cfg.type,
        created_at: now,
        expires_at: expiresAt,
        is_revoked: false,
      },
    };
  }

  setTokenCookie(reply: FastifyReply, token: string, cfg: TokenCfg) {
    reply.setCookie(cfg.cookieName, token, cfg.cookieOptions);
  }

  // TODO: Revisar a futuro
  verifyToken(token: string, cfg: TokenCfg) {
    try {
      return jwt.verify(token, cfg.secret, {
        issuer: this.config.issuer,
        algorithms: [this.config.algorithm],
      });
    } catch (err) {
      return null; // o lanzar un error custom
    }
  }
}
