import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(1, "Senha obrigatória"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const CadastroSchema = z.object({
  nome: z.string().min(1, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  baseId: z.coerce.number().min(1, "Selecione uma base"),
});

export type CadastroInput = z.infer<typeof CadastroSchema>;