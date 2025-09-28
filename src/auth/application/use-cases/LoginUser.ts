import { IUserRepository } from "../../../user/domain/IUserRepository";
import bcrypt from "bcrypt";
import { DeviceInfoDTO } from "../dto/deviceInfo";
import { IUserTokensRepository } from "../../domain/IUserTokensRepository";
import { TOKENS_CONFIG } from "../../../config/tokens";
import { safeParseLogin } from "../../../validation/auth/AuthSchemas";
import { AuthError } from "../../../errors";
import { TokenService } from "../../../services/TokenService";

export class LoginUser {
  constructor(
    private userRepository: IUserRepository,
    private userTokensRepository: IUserTokensRepository,
    private tokenService: TokenService,
    private tokensConfig = TOKENS_CONFIG
  ) {}

  async execute(
    credential: string,
    password: string,
    deviceInfo: DeviceInfoDTO
  ): Promise<any> {
    try {
      // TODO: "integrar" el parse del login al caso de uso.
      const parseResult = safeParseLogin(credential, password);

      if (!parseResult.success)
        throw AuthError.userDataInput(parseResult.error);

      const dbUser = await this.findUserByCredential(parseResult.data);

      if (!dbUser) throw AuthError.userNotFound();

      const isPasswordValid = await bcrypt.compare(password, dbUser.password);

      if (!isPasswordValid) throw AuthError.invalidPassword();

      console.log("✅ Credenciales válidas para usuario:", dbUser.username);

      const access = this.tokenService.generateTokenData(
        dbUser,
        this.tokensConfig.access
      );
      const refresh = this.tokenService.generateTokenData(
        dbUser,
        this.tokensConfig.refresh
      );

      // ✅ 5. Guardar tokens en base de datos
      await this.userTokensRepository.saveLoginTokens(
        dbUser.id!,
        { access, refresh },
        deviceInfo
      );

      console.log("🔐 Tokens generados y guardados exitosamente");

      return {
        accessToken: access.token,
        refreshToken: refresh.token,
      };
    } catch (error: any) {
      throw AuthError.wrap(error);
    }
  }

  private async findUserByCredential(loginData: any): Promise<any> {
    // Type guards para detectar el tipo
    if ("email" in loginData) {
      console.log("🔍 Buscando usuario por email:", loginData.email);
      return await this.userRepository.findByEmail(loginData.email);
    } else if ("username" in loginData) {
      console.log("🔍 Buscando usuario por username:", loginData.username);
      return await this.userRepository.findByUsername(loginData.username);
    }
  }
}
