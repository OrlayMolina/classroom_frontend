export interface ConfiguracionExamenDto {
    configId: number;
    peso: number;
    umbral: number;
    fechaHora?: Date;
    cantPreguntas: number;
    modoSeleccion: string;
    limiteTiempo: number;
    examenId: number;
}

// export interface ConfiguracionExamenDto {
//   configuracionId?: number;
//   examenId: number;
//   aleatorizarPreguntas: boolean;
//   aleatorizarOpciones: boolean;
//   mostrarProgreso: boolean;
// }