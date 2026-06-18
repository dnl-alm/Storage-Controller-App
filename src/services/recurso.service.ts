import http from "@/lib/http";
import { HateoasCollection, Recurso, StatusRecurso } from "@/lib/types";
import { RecursoInput } from "@/schemas/recurso.schema";

export const recursoService = {
  async listar(): Promise<Recurso[]> {
    const res = await http.get<HateoasCollection<Recurso>>("/recursos");
    return res.data._embedded?.recursoListagemDTOList ?? [];
  },

  async listarPorSetor(setorId: number): Promise<Recurso[]> {
    const res = await http.get<HateoasCollection<Recurso>>(`/recursos/setor/${setorId}`);
    return res.data._embedded?.recursoListagemDTOList ?? [];
  },

  async listarPorBase(baseId: number): Promise<Recurso[]> {
    const res = await http.get<HateoasCollection<Recurso>>(`/recursos/base/${baseId}`);
    return res.data._embedded?.recursoListagemDTOList ?? [];
  },

  async listarPorStatus(status: StatusRecurso): Promise<Recurso[]> {
    const res = await http.get<HateoasCollection<Recurso>>(`/recursos/status/${status}`);
    return res.data._embedded?.recursoListagemDTOList ?? [];
  },

  async buscarPorId(id: number): Promise<Recurso> {
    const res = await http.get<Recurso>(`/recursos/${id}`);
    return res.data;
  },

  async criar(data: RecursoInput, usuarioId: number): Promise<Recurso> {
    const res = await http.post<Recurso>(`/recursos?usuarioId=${usuarioId}`, data);
    return res.data;
  },

  async atualizar(id: number, data: Omit<RecursoInput, "setorId">, usuarioId: number): Promise<Recurso> {
    const res = await http.put<Recurso>(`/recursos/${id}?usuarioId=${usuarioId}`, data);
    return res.data;
  },

  async deletar(id: number, usuarioId: number): Promise<void> {
    await http.delete(`/recursos/${id}?usuarioId=${usuarioId}`);
  },
};