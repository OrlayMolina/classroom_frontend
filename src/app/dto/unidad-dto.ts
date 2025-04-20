import { ContenidoDto } from "./contenido-dto";

export interface UnidadDto {
    unidadId: number;
    nombreUnidad: string;
    contenidoIds: number[];
    numeroContenidos: number;
    contenidos: ContenidoDto[];
}
