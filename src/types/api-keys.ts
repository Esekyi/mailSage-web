export interface APIKey {
  id: number;
  name: string;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
}

export interface CreateAPIKeyRequest {
  name: string;
  permissions?: Record<string, any>;
}

export interface CreateAPIKeyResponse {
  message: string;
  api_key: string;
  key_id: number;
  name: string;
}

export interface APIKeysListResponse {
  api_keys: APIKey[];
}

export interface RevokeAPIKeyResponse {
  message: string;
}
