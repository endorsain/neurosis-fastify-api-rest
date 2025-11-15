import bcrypt from "bcrypt";
import { IUserRepository } from "../../../user/domain/IUserRepository";
import { IUserTokensRepository } from "../../domain/IUserTokensRepository";
import { AuthError } from "../../../errors";

export class RegisterUser {
  constructor(
    private userRepository: IUserRepository,
    private userTokensRepository: IUserTokensRepository
  ) {}

  async execute(registerData: {
    email: string;
    username: string;
    password: string;
  }): Promise<void> {
    try {
      //TODO: Hacer la validacion de ingreso de datos
      const hashedPassword = await bcrypt.hash(registerData.password, 12);

      const emailExist = await this.userRepository.findByEmail(
        registerData.email
      );
      const usernameExist = await this.userRepository.findByUsername(
        registerData.username
      );

      // if (emailExist! || usernameExist!)
      //   throw AuthError.emailOrUsernameAlreadyExists();

      if (emailExist) {
        throw AuthError.emailAlreadyExists();
      }
      if (usernameExist) {
        throw AuthError.usernameAlreadyExists();
      }

      const newUser = await this.userRepository.createUser({
        ...registerData,
        password: hashedPassword,
      });

      await this.userTokensRepository.createUserTokensDocument({
        id: newUser.id,
        username: newUser.username,
      });
      //TODO: Luego el documento 'user_tokens' se puede añadir
      // la id en el documento de 'user'
      console.log("Todo salio bien!");
    } catch (error: any) {
      throw AuthError.wrap(error);
    }
  }
}
