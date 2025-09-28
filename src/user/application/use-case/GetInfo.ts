import { IUserRepository } from "../../domain/IUserRepository";

export class GetInfo {
  constructor(private userRepository: IUserRepository) {}

  async execute(accessTokenData: any): Promise<any> {
    try {
      console.log("GetInfo - accessTokenData: ", accessTokenData);

      const dbUser = await this.userRepository.findById(accessTokenData.userId);

      return dbUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
