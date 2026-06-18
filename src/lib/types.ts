export type HateoasLinks = {
  _links?: Record<string, { href: string }>;
};

export type Base = HateoasLinks & {
  id: number;
  nome: string;
};

export type Setor = HateoasLinks & {
  id: number;
  baseId: number;
  baseNome: string;
  nome: string;
  descricao: string | null;
};

export type StatusRecurso = "OK" | "ATENCAO" | "CRITICO";

export type Recurso = HateoasLinks & {
  id: number;
  nome: string;
  categoria: string;
  quantidade: number;
  minimo: number;
  capacidadeMaxima: number;
  critico: boolean;
  status: StatusRecurso;
  ultimaAtualizacao: string;
  setorId: number;
  setorNome: string;
  baseId: number;
};

export type TipoMovimentacao = "CONSUMO" | "REABASTECIMENTO";

export type Movimentacao = HateoasLinks & {
  id: number;
  recursoId: number;
  recursoNome: string;
  setorId: number;
  setorNome: string;
  usuarioId: number;
  usuarioNome: string;
  tipoMovimentacao: TipoMovimentacao;
  quantidade: number;
  descricao: string | null;
  dataMovimentacao: string;
};

export type Alerta = HateoasLinks & {
  id: number;
  recursoId: number;
  recursoNome: string;
  setorId: number;
  setorNome: string;
  baseId: number;
  mensagem: string;
  nivel: string;
  resolvido: boolean;
  dataAlerta: string;
};

export type TipoUsuario = "OPERATOR" | "VIEWER";

export type Usuario = HateoasLinks & {
  id: number;
  nome: string;
  email: string;
  baseId: number;
  tipoUsuario: TipoUsuario;
};

export type HateoasCollection<T> = {
  _embedded?: { [key: string]: T[] };
  _links?: Record<string, { href: string }>;
};