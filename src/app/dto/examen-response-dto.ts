export interface ExamenResponseDto {
  examenId: number;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  cantBancoPreguntas: number;           // Backend: cantBancoPreguntas
  cantPreguntasEstudiante: number;      // Backend: cantPreguntasEstudiante
  limiteTiempo: number;                 // Backend: limiteTiempo
  fechaProgramada: string;              // Backend: fechaProgramada
  tipoPruebaNombre: string;             // Backend: tipoPruebaNombre
  tipoPruebaId: number;
  profesorId: number;
  temaId?: number;
  temaNombre?: string;                  // Backend: temaNombre
  cursoId: number;
  cursoNombre?: string;                 // Backend: cursoNombre
pesoCurso: number;
  umbralAprobacion: number;
  
  // Propiedades adicionales para la vista
  numeroEstudiantes?: number;
  promedioCalificaciones?: number;
  estado?: 'Disponible' | 'Próximamente' | 'Finalizado';
  
  // Configuraciones del examen
  aleatorizarPreguntas?: boolean;
  aleatorizarOpciones?: boolean;
  mostrarProgreso?: boolean;
}

export interface CrearExamenRequestDto {
  nombre: string;
  descripcion?: string;
  categoria?: string;
  cantPreguntasTotal: number;
  cantPreguntasMostrar: number;
  tiempoLimiteMinutos: number;
  fechaHoraDisponible: string;
  tipoPruebaId: number;
  profesorId: number;
  temaId?: number;
  cursoId: number;
  bancoId?: number;
  pesoCurso: number;
  umbralAprobacion: number;
  mostrarRetroalimentacion: boolean;
}

export interface ActualizarExamenRequestDto extends CrearExamenRequestDto {
  examenId: number;
}

export interface ConfiguracionExamenDto {
  configuracionId?: number;
  examenId: number;
  aleatorizarPreguntas: boolean;
  aleatorizarOpciones: boolean;
  mostrarProgreso: boolean;
}

export interface EstadisticasExamenDto {
  examenId: number;
  totalEstudiantes: number;
  estudiantesPresentados: number;
  promedioCalificaciones: number;
  calificacionMaxima: number;
  calificacionMinima: number;
  porcentajeAprobacion: number;
}

export interface CrearExamenRequestDto {
  nombre: string;
  descripcion?: string;
  categoria?: string;
  cantPreguntasTotal: number;
  cantPreguntasMostrar: number;
  tiempoLimiteMinutos: number;
  fechaHoraDisponible: string;
  tipoPruebaId: number;
  profesorId: number;
  temaId?: number;
  cursoId: number;
  bancoId?: number;
  pesoCurso: number;
  umbralAprobacion: number;
  mostrarRetroalimentacion: boolean;
}

export interface ActualizarExamenRequestDto extends CrearExamenRequestDto {
  examenId: number;
}

export interface ConfiguracionExamenDto {
  configuracionId?: number;
  examenId: number;
  aleatorizarPreguntas: boolean;
  aleatorizarOpciones: boolean;
  mostrarProgreso: boolean;
}

export interface EstadisticasExamenDto {
  examenId: number;
  totalEstudiantes: number;
  estudiantesPresentados: number;
  promedioCalificaciones: number;
  calificacionMaxima: number;
  calificacionMinima: number;
  porcentajeAprobacion: number;
}