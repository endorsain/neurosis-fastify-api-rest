import { IUserRepository } from "../domain/IUserRepository";
import { GetInfo } from "./use-case";

export class UserService {
  private getInfo: GetInfo;

  constructor(private userRepository: IUserRepository) {
    this.getInfo = new GetInfo(userRepository);
  }

  async getInfoUseCase(accessTokenData: any): Promise<any> {
    return await this.getInfo.execute(accessTokenData);
  }
}
