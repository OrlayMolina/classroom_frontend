import { RespuestaDto } from "./respuesta-dto";

export interface EnvioExamenDto {
    envioId?: number;
    fechaInicio?: Date;
    fechaFin?: Date;
    puntaje?: number;
    ip?: string;
    examenId: number;
    estudianteId: number;
    nombreExamen?: string;
    nombreEstudiante?: string;
    apellidoEstudiante?: string;
    tiempoTotalMinutos?: number;
    respuestas?: RespuestaDto[];
}
