import * as z from "zod";

export const SetorSchema = z.object({
  baseId: z.coerce.number().min(1, "Base obrigatória"),

  nome: z.string().min(1, "Nome obrigatório"),

  descricao: z.string().optional(),
});

export type SetorInput = z.infer<typeof SetorSchema>;