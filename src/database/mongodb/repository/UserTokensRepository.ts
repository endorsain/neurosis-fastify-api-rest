import { IUserTokensRepository } from "../../../auth/domain/IUserTokensRepository";
import { DatabaseError } from "../../../errors";
import { UserTokensModel } from "../models/UserTokensModel";

export class userTokensMongoRepository implements IUserTokensRepository {
  async createUserTokensDocument(user: any): Promise<any> {
    try {
      console.log("🏗️ Creando documento de tokens para usuario:", user);

      const userTokensDoc = new UserTokensModel({
        user: {
          id: user.id,
          username: user.username,
        },
      });
      //TODO: Creo que si no crea el usuario no muestra un error. Solucionar
      const userTokens = await userTokensDoc.save();
      console.log("✅ Documento de tokens creado exitosamente");
      return userTokens;
    } catch (error: any) {
      throw DatabaseError.wrap(error);
    }
  }

  async saveLoginTokens(
    userId: string,
    tokensData: any,
    deviceInfo: any
  ): Promise<any> {
    try {
      console.log("💾 Guardando tokens para usuario:", userId);

      // Preparar tokens para BD
      const accessTokenForDB = {
        ...tokensData.access.data,
        device_info: deviceInfo,
      };
      const refreshTokenForDB = {
        ...tokensData.refresh.data,
        device_info: deviceInfo,
      };

      // ✅ UPSERT: Crear si no existe, actualizar si existe
      await UserTokensModel.updateOne(
        {
          "user.id": userId,
        },
        {
          $push: {
            access_tokens: accessTokenForDB,
            refresh_tokens: refreshTokenForDB,
          },
          $set: {
            last_cleanup_at: new Date(),
          },
        },
        { upsert: true } // ✅ Crear documento si no existe
      );

      console.log("✅ Tokens guardados exitosamente");
    } catch (error: any) {
      throw DatabaseError.wrap(error);
    }
  }

  async cleanupExpiredTokens(userId: string): Promise<any> {
    // TODO: Implementar limpieza de tokens expirados
    console.log("🧹 Limpiando tokens expirados para usuario:", userId);
  }

  async revokeAllTokens(userId: string): Promise<any> {
    // TODO: Implementar revocación de todos los tokens
    console.log("🚫 Revocando todos los tokens para usuario:", userId);
  }
}
