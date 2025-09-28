export interface IAccessToken {
  token_id: string; // UUID único - identificador del token en BD
  token_hash: string; // SHA256 del token real - por seguridad
  token_type: "access"; // Tipo de token (vs refresh)
  device_info?: {
    // Info del dispositivo para seguridad
    user_agent?: string; // Navegador del usuario
    ip_address?: string; // IP desde donde se registró
    device_name?: string; // "Chrome on Windows"
  };
  created_at: Date; // Cuándo se creó el token
  expires_at: Date; // Cuándo expira (ej: 24 horas)
  last_used_at?: Date; // Última vez usado (para auditoría)
  is_revoked: boolean; // Si fue invalidado manualmente
}

export interface IContextToken {
  token_id: string;
  token_hash: string;
  token_type: "context";
  dynamic_context: {
    current_month_tracking_id: string; // Cambia cada mes
    // active_session_id?: string; // Cambia cada sesión
  };
  static_context: {
    user_id: string;
    // activity_ids: string[]; // IDs de actividades del usuario
    // preferences_id?: string; // ID de configuración
  };
  created_at: Date;
  expires_at: Date;
  is_revoked: boolean;
}

export interface IRefreshToken {
  token_id: string;
  token_hash: string;
  token_type: "refresh";
  token_family: string; // Para token rotation
  access_token_id?: string; // Relación con access token
  device_info?: {
    user_agent?: string;
    ip_address?: string;
    device_name?: string;
  };
  created_at: Date;
  expires_at: Date;
  last_used_at?: Date;
  is_revoked: boolean;
}

export interface ITokensData {
  access_tokens: IAccessToken[];
  context_tokens: IContextToken[];
  refresh_tokens: IRefreshToken[];
  last_cleanup_at?: Date; // Para limpiar tokens expirados
}
