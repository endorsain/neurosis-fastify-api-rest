import {
  RegisterUser,
  LoginUser,
  AccessWithGoogleUser,
  RegisterWithGoogleUser,
} from "./use-cases";
import { IUserRepository } from "../../user/domain/IUserRepository";
import { DeviceInfoDTO } from "./dto/deviceInfo";
import { IUserTokensRepository } from "../domain/IUserTokensRepository";
import { TOKENS_CONFIG } from "../../config/tokens";
import { TokenService } from "../../services/TokenService";

export class AuthService {
  private registerUser: RegisterUser;
  private loginUser: LoginUser;
  private accessWithGoogleUser: AccessWithGoogleUser;
  private registerWithGoogleUser: RegisterWithGoogleUser;
  private tokenService: TokenService;

  constructor(
    private userRepository: IUserRepository,
    private userTokensRepository: IUserTokensRepository
  ) {
    this.tokenService = new TokenService(TOKENS_CONFIG);
    this.registerUser = new RegisterUser(userRepository, userTokensRepository);
    this.loginUser = new LoginUser(
      userRepository,
      userTokensRepository,
      this.tokenService
    );
    this.loginUser = new LoginUser(
      userRepository,
      userTokensRepository,
      this.tokenService
    );
    this.accessWithGoogleUser = new AccessWithGoogleUser(
      userRepository,
      userTokensRepository,
      this.tokenService
    );
    this.registerWithGoogleUser = new RegisterWithGoogleUser(
      userRepository,
      userTokensRepository,
      this.tokenService
    );
  }

  // TODO: Hacer DTOs
  async registerUserUseCase({ email, username, password }: any): Promise<any> {
    return await this.registerUser.execute({
      email,
      username,
      password,
    });
  }

  async loginUserUseCase(
    credential: string,
    password: string,
    deviceInfo: DeviceInfoDTO
  ): Promise<any> {
    return await this.loginUser.execute(credential, password, deviceInfo);
  }

  async accessWithGoogleUseCase(
    googleCredential: string,
    deviceInfo: DeviceInfoDTO
  ): Promise<any> {
    return await this.accessWithGoogleUser.execute(
      googleCredential,
      deviceInfo
    );
  }

  async registerWithGoogleUseCase(
    googleCredential: string,
    username: string,
    password: string,
    deviceInfo: DeviceInfoDTO
  ): Promise<any> {
    return await this.registerWithGoogleUser.execute(
      googleCredential,
      username,
      password,
      deviceInfo
    );
  }
}
