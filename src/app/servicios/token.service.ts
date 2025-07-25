import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Buffer } from "buffer";

const TOKEN_KEY = "AuthToken";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private router: Router) { }

  public setToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public isLogged(): boolean {
    return !!this.getToken();
  }

  public login(token: string) {
    this.setToken(token);
  }

  public logout() {
    window.sessionStorage.clear();
    this.router.navigate(["/login"]);
  }

  public decodePayload(token: string): any {
    const payload = token.split(".")[1];
    const payloadDecoded = Buffer.from(payload, 'base64').toString('utf-8');
    const values = JSON.parse(payloadDecoded);
    return values;
  }

  public getIDCuenta(): string {
    const token = this.getToken();
    if (token) {
      const values = this.decodePayload(token);
      return values.user_id;
    }
    return '';
  }

  public getUsuarioActual(): string {
    const token = this.getToken();
    if (token) {
      const values = this.decodePayload(token);
      return values.rol_id;
    }
    return '';
  }

  public getEmail(): string {
    const token = this.getToken();
    if (token) {
      const values = this.decodePayload(token);
      return values.correo;
    }
    return '';
  }
}
