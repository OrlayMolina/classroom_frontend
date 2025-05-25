export interface ExamenDto {
  examenId: number;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  cantPreguntasTotal: number;
  cantPreguntasMostrar: number;
  tiempoLimiteMinutos: number;
  fechaHoraDisponible: string;
  tipoPrueba: string;
  tipoPruebaId: number;
  profesorId: number;
  temaId?: number;
  tema?: string;
  cursoId: number;
  bancoId?: number;
  pesoCurso: number;
  umbralAprobacion: number;
  mostrarRetroalimentacion: boolean;
  
  // Propiedades adicionales para la vista
  numeroEstudiantes?: number;
  promedioCalificaciones?: number;
  estado?: 'Disponible' | 'Próximamente' | 'Finalizado';
  
  // Configuraciones del examen
  aleatorizarPreguntas?: boolean;
  aleatorizarOpciones?: boolean;
  mostrarProgreso?: boolean;
}

export interface CrearExamenDto {
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

export interface ActualizarExamenDto extends CrearExamenDto {
  examenId: number;
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