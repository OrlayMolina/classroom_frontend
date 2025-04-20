import { PlanEstudioDto } from "./plan-estudio-dto";

export interface ContenidoDto {
    contenidoId: number;
    descripcionContenido: string;
    unidadId: number;
    nombreUnidad: string;
    planEstudioIds: number[];
    numeroPlanesEstudio: number;
    planesEstudio: PlanEstudioDto[]
}
