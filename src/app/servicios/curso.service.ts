import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { CursoDto } from '../dto/curso-dto';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private courseUrl = "http://localhost:8080/api/cursos";

  constructor(private http: HttpClient) { }

  // Obtener todos los cursos
  obtenerTodos(): Observable<MensajeDTO>{
    return this.http.get<MensajeDTO>(this.courseUrl);
  }

  // Obtener un curso específico por ID
  obtenerPorId(id: number): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.courseUrl}/${id}`);
  }

  // Obtener cursos por profesor
  obtenerCursosProfesor(profesorId: number): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.courseUrl}/profesor/${profesorId}`);
  }

  // Obtener cursos por estudiante
  obtenerCursosEstudiante(estudianteId: number): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.courseUrl}/estudiante/${estudianteId}`);
  }

  // Crear un nuevo curso
  crear(curso: any): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(this.courseUrl, curso);
  }

  // Actualizar un curso existente
  actualizar(id: number, curso: CursoDto): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.courseUrl}/${id}`, curso);
  }

  // Eliminar un curso
  eliminar(id: number): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.courseUrl}/${id}`);
  }

  // Matricular un estudiante en un curso
  matricularEstudiante(cursoId: number, estudianteId: number): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.courseUrl}/${cursoId}/matricular/${estudianteId}`, {});
  }

  // Retirar un estudiante de un curso
  retirarEstudiante(cursoId: number, estudianteId: number): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.courseUrl}/${cursoId}/retirar/${estudianteId}`);
  }

  // Verificar si un estudiante está matriculado en un curso
  verificarMatricula(cursoId: number, estudianteId: number): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.courseUrl}/${cursoId}/matriculado/${estudianteId}`);
  }
}