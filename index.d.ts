export type Marca =
  | "travessao"
  | "markdown"
  | "nao_e_x_e_y"
  | "sem_sem_sem"
  | "anuncio"
  | "vocabulario_ia"
  | "caso_inventado"
  | "emoji"
  | "frase_feita"
  | "essencial_fundamental";

export interface Regra {
  descricao: string;
  forte: boolean;
  regex: RegExp;
}

export interface Achado {
  marca: Marca;
  descricao: string;
  forte: boolean;
  trecho: string;
  inicio: number;
}

export interface Avaliacao {
  temMarcaForte: boolean;
  total: number;
  porMarca: Partial<Record<Marca, number>>;
  achados: Achado[];
}

export interface Opcoes {
  ignorar?: Marca[];
}

export declare const regras: Record<Marca, Regra>;
export declare function encontrar(texto: string, opcoes?: Opcoes): Achado[];
export declare function avaliar(texto: string, opcoes?: Opcoes): Avaliacao;
