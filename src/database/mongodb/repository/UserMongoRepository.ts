import { DatabaseError } from "../../../errors";
import { IUserRepository } from "../../../user/domain/IUserRepository";
import { UserModel } from "../models/UserModel";

// TODO: Usar trycatch para errores de Mongodb
export class UserMongoRepository implements IUserRepository {
  async createUser(userData: {
    email: string;
    username: string;
    password: string;
  }): Promise<any> {
    try {
      const userDoc = new UserModel({
        account: {
          email: userData.email,
          password: userData.password,
        },
        public_profile: {
          username: userData.username,
        },
      });
      const savedUser = await userDoc.save();

      return this.mapUserDocument(savedUser);
    } catch (error: any) {
      throw DatabaseError.wrap(error);
    }
  }

  async findById(id: string): Promise<any> {
    try {
      const user = await UserModel.findById(id);
      return this.mapUserDocument(user);
    } catch (error: any) {
      throw DatabaseError.wrap(error);
    }
  }

  async findByEmail(email: string): Promise<any> {
    try {
      const user = await UserModel.findOne({
        "account.email": email.toLowerCase().trim(),
      });

      return user ? this.mapUserDocument(user) : null;
    } catch (error: any) {
      throw DatabaseError.wrap(error);
    }
  }

  async findByUsername(username: string): Promise<any> {
    try {
      const user = await UserModel.findOne({
        "public_profile.username": username.trim(),
      });
      return user ? this.mapUserDocument(user) : null;
    } catch (error: any) {
      throw DatabaseError.wrap(error);
    }
  }

  //   private mongoToEntity(doc: any): UserEntity {
  private mapUserDocument(doc: any) {
    return {
      id: doc._id.toString(),
      email: doc.account.email,
      username: doc.public_profile.username,
      password: doc.account.password,
      emailVerified: doc.account.email_verified,
      roles: doc.account.roles,
    };
  }
}
