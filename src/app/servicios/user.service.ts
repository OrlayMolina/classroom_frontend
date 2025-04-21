import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { UsuarioDto } from '../dto/usuario-dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userURL = "http://localhost:8080/api/usuarios";

  constructor(private http: HttpClient) { }

  public getUsuario(id: number): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.userURL}/${id}`);
  }

  public actualizarUsuario(id: number, usuario: UsuarioDto): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.userURL}/${id}`, usuario);
  }

  public nombreRolUsuario(id:number): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.userURL}/rol/${id}`);
  }
}
