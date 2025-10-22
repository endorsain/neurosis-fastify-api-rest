import bcrypt from "bcrypt";
import { IUserRepository } from "../../../user/domain/IUserRepository";
import { DeviceInfoDTO } from "../dto/deviceInfo";
import { IUserTokensRepository } from "../../domain/IUserTokensRepository";
import { TokenService } from "../../../services/TokenService";
import { TOKENS_CONFIG } from "../../../config/tokens";
import { AuthError, GoogleAuthError } from "../../../errors";

export class RegisterWithGoogleUser {
  constructor(
    private userRepository: IUserRepository,
    private userTokensRepository: IUserTokensRepository,
    private tokenService: TokenService,
    private tokensConfig = TOKENS_CONFIG
  ) {}

  async execute(
    googleCredential: string,
    username: string,
    password: string,
    deviceInfo: DeviceInfoDTO
  ): Promise<any> {
    try {
      // ✅ 1. Verificar y decodificar token de Google
      const googlePayload = await this.verifyGoogleToken(googleCredential);

      const hashedPassword = await bcrypt.hash(password, 12);

      // ✅ 2. Extraer email del token
      const emailExist = await this.userRepository.findByEmail(
        googlePayload.email
      );
      const usernameExist = await this.userRepository.findByUsername(username);

      if (emailExist! || usernameExist!)
        throw AuthError.emailOrUsernameAlreadyExists();

      const newUser = await this.userRepository.createUser({
        email: googlePayload.email,
        username: username,
        password: hashedPassword,
      });

      await this.userTokensRepository.createUserTokensDocument({
        id: newUser.id,
        username: newUser.username,
      });

      const access = this.tokenService.generateTokenData(
        newUser,
        this.tokensConfig.access
      );
      const refresh = this.tokenService.generateTokenData(
        newUser,
        this.tokensConfig.refresh
      );

      await this.userTokensRepository.saveLoginTokens(
        newUser.id!,
        { access, refresh },
        deviceInfo
      );

      return {
        accessToken: access.token,
        refreshToken: refresh.token,
      };
    } catch (error: any) {
      throw AuthError.wrap(error);
    }
  }

  //TODO: Hacer errores de api de google.
  // Estos errores se van a añadir a AuthError, por lo tanto
  // se va a poder usar en otras clases o para otras cosas(middlewares).
  private async verifyGoogleToken(googleCredential: string): Promise<any> {
    try {
      console.log("🔍 Verificando token de Google...");

      // ✅ OPCIÓN 1: Verificación con API de Google (RECOMENDADA para producción)
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${googleCredential}`
      );

      if (!response.ok) {
        // throw new GoogleTokenInvalidError();
        throw GoogleAuthError.googleTokenInvalid(response);
      }

      const payload = await response.json();

      // Verificar que el token sea válido
      if (!payload.email || !payload.email_verified) {
        // throw new GoogleEmailNotVerifiedError();
        throw GoogleAuthError.googleEmailNotVerified();
      }

      // Verificar que no haya expirado
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        // throw new GoogleTokenExpiredError();
        throw GoogleAuthError.googleTokenExpired();
      }

      console.log("✅ Token de Google verificado correctamente");
      return payload;
    } catch (error: any) {
      console.error("❌ Error verificando token de Google:", error);
      // throw new GoogleTokenInvalidError();
      throw GoogleAuthError.wrap(error);
    }
  }
}
