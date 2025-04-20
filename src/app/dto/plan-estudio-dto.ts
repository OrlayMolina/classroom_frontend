export interface PlanEstudioDto {
    preguntaId: number;
    texto: string;
    tipo: string
    porcentaje: number;
    dificultad: string;
    tiempoMaximo: number;
    esPublica: number;
    temaId: number;
    profesorId: number;
    preguntaPadreId: number;
}
