export interface SignInBodyModel {
  email: string;
  password: string;
  returnSecureToken: boolean;
}

export interface SignInResponeModel {
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
}
