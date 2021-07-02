import { AuthStateEnum } from "./auth.state";

export class SetAuthState {
  static readonly type = '[Auth] Set auth state';
  constructor(public state: AuthStateEnum) {}
}
