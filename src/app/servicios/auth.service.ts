import { Injectable } from '@angular/core';
import { MensajeDTO } from '../dto/mensaje-dto';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginDTO } from '../dto/login-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authURL = "http://localhost:8080/api/auth";
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }

  public login(loginDTO: LoginDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/autenticar`, loginDTO);
  }

  setUser(email: string) {
    this.userSubject.next(email);
  }

  logout() {
    this.userSubject.next(null);
  }
}
