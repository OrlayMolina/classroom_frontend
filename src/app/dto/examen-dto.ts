export interface ExamenDto {
    examenId?: number;
    nombre: string;
    descripcion?: string;
    categoria?: string;
    cantBancoPreguntas?: number;
    cantPreguntasEstudiante?: number;
    limiteTiempo?: number;
    fechaProgramada?: Date;
    profesorId: number;
    temaId: number;
    tipoPruebaId: number;
    cursoId: number;
    nombreProfesor?: string;
    apellidoProfesor?: string;
    nombreTema?: string;
    nombreTipoPrueba?: string;
    nombreCurso?: string;
}