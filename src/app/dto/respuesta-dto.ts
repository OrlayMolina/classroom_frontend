export interface RespuestaDto {
    respuestaId: number;
    respuesta: string;
    envioId: number;
    preguntaId: number;
    textoPregunta: string;
    esCorrecta: boolean;
}
