export interface DeletedTemplate {
  id: number;
  name: string;
  category: string | null;
  deleted_at: string;
}

export interface DeletedSMTP {
  id: number;
  name: string;
  host: string;
  updated_at: string;
}

export interface DeletedItemsResponse {
  templates: DeletedTemplate[];
  smtp_configs: DeletedSMTP[];
}

export interface RestoreResponse {
  message: string;
}

export interface DeleteResponse {
  message: string;
}

export interface ApiError {
  error: string;
}
