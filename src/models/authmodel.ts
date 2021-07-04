export interface SignInBodyModel {
  email: string;
  password: string;
  returnSecureToken?: boolean;
  rememberUser?: boolean;
}

export interface AuthenticatedDataModel {
  displayName?: string;
  email?: string;
  expiresIn: string;
  idToken?: string;
  kind?: string;
  localId?: string;
  refreshToken?: string;
  registered?: boolean;
  accessToken?: string;
  projectId?: string;
  tokenType: string;
  userId: string;
  rememberUser?: boolean;
  expireTime?: number;
}
