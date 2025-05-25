import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { 
  ExamenDto, 
  CrearExamenDto, 
  ActualizarExamenDto, 
  EstadisticasExamenDto 
} from '../dto/examen-dto';
import { ConfiguracionExamenDto } from '../dto/configuracion-examen-dto';

@Injectable({
  providedIn: 'root'
})
export class ExamenService {
  private apiUrl = 'http://localhost:8080/api/examenes';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Obtener todos los exámenes de un curso
  obtenerExamenesPorCurso(cursoId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/curso/${cursoId}`, {
      headers: this.getHeaders()
    });
  }

  // Obtener un examen por ID
  obtenerExamenPorId(examenId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${examenId}`, {
      headers: this.getHeaders()
    });
  }

  // Obtener exámenes creados por un profesor
  obtenerExamenesProfesor(profesorId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profesor/${profesorId}`, {
      headers: this.getHeaders()
    });
  }

  // Obtener exámenes disponibles para un estudiante
  obtenerExamenesEstudiante(estudianteId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/estudiante/${estudianteId}`, {
      headers: this.getHeaders()
    });
  }

  // Crear un nuevo examen
  crearExamen(examen: CrearExamenDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, examen, {
      headers: this.getHeaders()
    });
  }

  // Actualizar un examen existente
  actualizarExamen(examen: ActualizarExamenDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${examen.examenId}`, examen, {
      headers: this.getHeaders()
    });
  }

  // Eliminar un examen
  eliminarExamen(examenId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${examenId}`, {
      headers: this.getHeaders()
    });
  }

  // Duplicar un examen
  duplicarExamen(examenId: number, nuevoNombre?: string): Observable<any> {
    const body = { nuevoNombre: nuevoNombre || `Copia de examen ${examenId}` };
    return this.http.post<any>(`${this.apiUrl}/${examenId}/duplicar`, body, {
      headers: this.getHeaders()
    });
  }

  // Configurar examen (aleatorización, progreso, etc.)
  configurarExamen(configuracion: ConfiguracionExamenDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${configuracion.examenId}/configuracion`, configuracion, {
      headers: this.getHeaders()
    });
  }

  // Obtener configuración de un examen
  obtenerConfiguracionExamen(examenId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${examenId}/configuracion`, {
      headers: this.getHeaders()
    });
  }

  // Iniciar presentación de examen
  iniciarExamen(examenId: number, estudianteId: number): Observable<any> {
    const body = { examenId, estudianteId };
    return this.http.post<any>(`${this.apiUrl}/${examenId}/iniciar`, body, {
      headers: this.getHeaders()
    });
  }

  // Finalizar presentación de examen
  finalizarExamen(envioId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/envio/${envioId}/finalizar`, {}, {
      headers: this.getHeaders()
    });
  }

  // Obtener estadísticas de un examen
  obtenerEstadisticasExamen(examenId: number): Observable<EstadisticasExamenDto> {
    return this.http.get<EstadisticasExamenDto>(`${this.apiUrl}/${examenId}/estadisticas`, {
      headers: this.getHeaders()
    });
  }

  // Obtener resultados de un examen para un estudiante
  obtenerResultadosEstudiante(examenId: number, estudianteId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${examenId}/resultados/estudiante/${estudianteId}`, {
      headers: this.getHeaders()
    });
  }

  // Obtener todos los resultados de un examen (para profesores)
  obtenerTodosLosResultados(examenId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${examenId}/resultados`, {
      headers: this.getHeaders()
    });
  }

  // Calificar examen automáticamente
  calificarExamen(envioId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/envio/${envioId}/calificar`, {}, {
      headers: this.getHeaders()
    });
  }

  // Obtener preguntas de un examen
  obtenerPreguntasExamen(examenId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${examenId}/preguntas`, {
      headers: this.getHeaders()
    });
  }

  // Agregar pregunta a un examen
  agregarPreguntaAExamen(examenId: number, preguntaId: number, puntuacion: number): Observable<any> {
    const body = { preguntaId, puntuacion };
    return this.http.post<any>(`${this.apiUrl}/${examenId}/preguntas`, body, {
      headers: this.getHeaders()
    });
  }

  // Remover pregunta de un examen
  removerPreguntaDeExamen(examenId: number, preguntaId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${examenId}/preguntas/${preguntaId}`, {
      headers: this.getHeaders()
    });
  }

  // Verificar disponibilidad de examen
  verificarDisponibilidadExamen(examenId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${examenId}/disponibilidad`, {
      headers: this.getHeaders()
    });
  }

  // Obtener historial de intentos de un estudiante
  obtenerHistorialIntentos(examenId: number, estudianteId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${examenId}/historial/${estudianteId}`, {
      headers: this.getHeaders()
    });
  }

  // Exportar resultados a CSV/Excel
  exportarResultados(examenId: number, formato: 'csv' | 'excel'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${examenId}/exportar/${formato}`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }
}