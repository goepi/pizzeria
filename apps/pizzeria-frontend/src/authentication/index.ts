import * as api from '../api/';

class Authentication {
  private token: string | null = null;
  private expires: number | null = null;
  private username: string | null = null;

  public signUp = async (username: string, password: string, address: string, email: string) => {
    try {
      await api.signUp(username, password, email, address);
      return true;
    } catch (e) {
      return false;
    }
  };

  public async login(username: string, password: string) {
    try {
      const result = await api.login(username, password);
      if (result) {
        this.token = result.id;
        this.expires = result.expires;
        this.username = username;
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  public async logout() {
    if (!this.isAuthenticated()) {
      try {
        await api.logout(this.token!);
        return true;
      } catch (e) {
        return false;
      }
    }
  }

  public isAuthenticated = () => {
    return this.token !== null && this.expires !== null && this.expires >= Date.now();
  };

  public getUsername = () => this.username;
  public getAuthToken = () => this.token;
}

export const Auth = new Authentication();
