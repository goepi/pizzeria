import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Auth } from '../../authentication';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

interface State {
  signIn: boolean;
  username?: string;
  password?: string;
  email?: string;
  address?: string;
  redirectToReferrer: boolean;
}

export class Login extends React.Component<RouteComponentProps, State> {
  public state: State = {
    signIn: true,
    username: undefined,
    password: undefined,
    email: undefined,
    address: undefined,
    redirectToReferrer: false,
  };

  private signIn = async () => {
    const { username, password } = this.state;
    if (username && password) {
      const result = await Auth.login(username, password);
      if (result) {
        this.setState({ redirectToReferrer: true });
      }
    }
  };

  private async signUp() {
    const { username, password, email, address } = this.state;
    if (username && password && email && address) {
      await Auth.signUp(username, password, address, email);
      await Auth.login(username, password);
    }
  }

  private toggleSignIn = () => this.setState((s: State) => ({ signIn: !s.signIn }));

  public setUsername = (username: string) => this.setState({ username });
  public setPassword = (password: string) => this.setState({ password });
  public setAddress = (address: string) => this.setState({ address });
  public setEmail = (email: string) => this.setState({ email });

  public render() {
    if (this.state.redirectToReferrer) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        {this.state.signIn ? (
          <SignInForm setUsername={this.setUsername} setPassword={this.setPassword} onSubmit={this.signIn} />
        ) : (
          <SignUpForm
            setUsername={this.setUsername}
            setPassword={this.setPassword}
            setAddress={this.setAddress}
            setEmail={this.setEmail}
            onSubmit={this.signUp}
          />
        )}

        <div>
          <a role="button" onClick={this.toggleSignIn}>
            {this.state.signIn ? 'No Account? Sign up!' : 'Already have an account? Sign in!'}
          </a>
        </div>
      </div>
    );
  }
}
