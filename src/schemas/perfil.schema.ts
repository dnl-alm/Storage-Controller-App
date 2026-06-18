import * as z from "zod";

export const PerfilSchema = z.object({
  nome: z.string().min(1, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type PerfilInput = z.infer<typeof PerfilSchema>;