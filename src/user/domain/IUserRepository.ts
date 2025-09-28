// import { AuthUser, CreateUserData, UserEntity } from "./types";

export interface IUserRepository {
  createUser(userData: any): Promise<any>;

  findById(userId: any): Promise<any>;

  findByEmail(email: any): Promise<any>;

  findByUsername(username: any): Promise<any>;
}
