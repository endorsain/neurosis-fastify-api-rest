export interface IAuthRepository {
  // Crear documento vacío de tokens para usuario nuevo
  createUserTokensDocument(userId: string): Promise<any>;

  // Guardar tokens de login
  saveLoginTokens(
    userId: string,
    tokensData: any,
    deviceInfo: any
  ): Promise<any>;

  // TODO:
  // Limpiar tokens expirados (futuro)
  cleanupExpiredTokens(userId: string): Promise<any>;
  // Revocar todos los tokens de un usuario (futuro)
  revokeAllTokens(userId: string): Promise<any>;
}
