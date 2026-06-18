import * as z from "zod";

export const RecursoSchema = z
  .object({
    setorId: z.coerce.number().min(1, "Selecione um setor"),
    nome: z.string().min(1, "Nome obrigatório"),
    categoria: z.string().min(1, "Categoria obrigatória"),
    quantidade: z.coerce.number().positive("Deve ser maior que zero"),
    minimo: z.coerce.number().positive("Deve ser maior que zero"),
    capacidadeMaxima: z.coerce.number().positive("Deve ser maior que zero"),
    critico: z.boolean().default(false),
  })
  .refine((d) => d.quantidade <= d.capacidadeMaxima, {
    message: "Quantidade não pode ser maior que a capacidade máxima",
    path: ["quantidade"],
  })
  .refine((d) => d.minimo < d.capacidadeMaxima, {
    message: "Mínimo deve ser menor que a capacidade máxima",
    path: ["minimo"],
  });

export type RecursoInput = z.infer<typeof RecursoSchema>;