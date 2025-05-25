export interface CursoDto {
    cursoId: number;
    nombre: string;
    planEstudioId: number;
    profesorId: number;
    horarioId: number;
    diaId: number;
    nombrePlanEstudio?: string;
    nombreProfesor?: string;
    apellidoProfesor?: string;
    horaInicio?: string;
    horaFin?: string;
    ubicacion?: string;
    nombreDia?: string;
  }