import * as z from "zod";

export const TIPOS_MOVIMENTACAO = [
  "CONSUMO",
  "REABASTECIMENTO",
] as const;

export const MovimentacaoSchema = z.object({
  recursoId: z.number().min(1, "Selecione um recurso"),

  usuarioId: z.number().min(1, "Usuário obrigatório"),

  tipoMovimentacao: z.enum(TIPOS_MOVIMENTACAO),

  quantidade: z.number().positive("Deve ser maior que zero"),

  descricao: z.string().optional(),
});

export type MovimentacaoInput = z.infer<typeof MovimentacaoSchema>;