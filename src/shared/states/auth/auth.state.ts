import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import * as Actions from './auth.actions';

export enum AuthStateEnum {
  unknow,
  authenticated,
  unAuthenticated,
}

@State<AuthStateEnum>({
  name: 'auth',
  defaults: AuthStateEnum.unknow,
})
@Injectable()
export class AuthState {
  constructor() {}

  @Action(Actions.SetAuthState)
  setAuthState(ctx: StateContext<AuthStateEnum>, action: Actions.SetAuthState) {
    ctx.setState(action.state);
  }
}
