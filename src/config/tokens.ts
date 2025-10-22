import jwt from "jsonwebtoken";

export type TokenType = "access" | "refresh";

export interface TokenCfg {
  secret: string;
  durationSeconds: number;
  cookieName: string;
  cookieOptions: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "strict" | "lax" | "none";
    path: string;
    maxAgeMs: number;
  };
  type: TokenType;
}

export interface TokensConfig {
  issuer: string;
  algorithm: jwt.Algorithm;
  tokenHashAlgo: string;
  access: TokenCfg;
  refresh: TokenCfg;
}

const NODE_PROD = process.env.NODE_ENV === "production";

const makeTokenCfg = (
  secretEnv: string | undefined,
  fallbackSecret: string,
  duration: number,
  cookieName: string,
  type: TokenType
): TokenCfg => ({
  secret: secretEnv || fallbackSecret,
  durationSeconds: duration,
  cookieName,
  cookieOptions: {
    httpOnly: true,
    secure: NODE_PROD,
    sameSite: NODE_PROD ? "strict" : "lax",
    path: "/",
    maxAgeMs: duration * 1000,
  },
  type,
});

const parseIntOr = (val: string | undefined, fallback: number) =>
  val ? Number(val) : fallback;

export const TOKENS_CONFIG = {
  issuer: process.env.JWT_ISSUER || "neurosis",
  // algorithm: (process.env.JWT_ALGORITHM as string) || "HS256",
  algorithm: (process.env.JWT_ALGORITHM as jwt.Algorithm) || "HS256",
  access: makeTokenCfg(
    process.env.JWT_ACCESS_SECRET,
    "dev_access_secret",
    parseIntOr(process.env.ACCESS_TOKEN_DURATION, 4 * 60 * 60),
    process.env.COOKIE_ACCESS || "access_token",
    "access"
  ),
  refresh: makeTokenCfg(
    process.env.JWT_REFRESH_SECRET,
    "dev_refresh_secret",
    parseIntOr(process.env.REFRESH_TOKEN_DURATION, 7 * 24 * 60 * 60),
    process.env.COOKIE_REFRESH || "refresh_token",
    "refresh"
  ),
  tokenHashAlgo: (process.env.TOKEN_HASH_ALGO as string) || "sha256",
  refreshTokenRotation:
    (process.env.REFRESH_TOKEN_ROTATION || "true") === "true",
};
