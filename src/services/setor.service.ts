import http from "@/lib/http";
import { HateoasCollection, Setor } from "@/lib/types";
import { SetorInput } from "@/schemas/setor.schema";

export const setorService = {
  async listar(): Promise<Setor[]> {
    const res = await http.get<HateoasCollection<Setor>>("/setores");
    return res.data._embedded?.setorListagemDTOList ?? [];
  },

  async listarPorBase(baseId: number): Promise<Setor[]> {
    const res = await http.get<HateoasCollection<Setor>>(`/setores/base/${baseId}`);
    return res.data._embedded?.setorListagemDTOList ?? [];
  },

  async buscarPorId(id: number): Promise<Setor> {
    const res = await http.get<Setor>(`/setores/${id}`);
    return res.data;
  },

  async criar(data: SetorInput): Promise<Setor> {
    const res = await http.post<Setor>("/setores", data);
    return res.data;
  },

  async atualizar(id: number, data: Omit<SetorInput, "baseId">): Promise<Setor> {
    const res = await http.put<Setor>(`/setores/${id}`, data);
    return res.data;
  },

  async deletar(id: number): Promise<void> {
    await http.delete(`/setores/${id}`);
  },
};