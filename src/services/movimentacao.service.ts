import http from "@/lib/http";
import { HateoasCollection, Movimentacao } from "@/lib/types";
import { MovimentacaoInput } from "@/schemas/movimentacao.schema";

export const movimentacaoService = {
  async listarPorRecurso(recursoId: number): Promise<Movimentacao[]> {
    const res = await http.get<HateoasCollection<Movimentacao>>(`/movimentacoes/recurso/${recursoId}`);
    return res.data._embedded?.movimentacaoListagemDTOList ?? [];
  },

  async listarPorSetor(setorId: number): Promise<Movimentacao[]> {
    const res = await http.get<HateoasCollection<Movimentacao>>(`/movimentacoes/setor/${setorId}`);
    return res.data._embedded?.movimentacaoListagemDTOList ?? [];
  },

  async listarPorBase(baseId: number): Promise<Movimentacao[]> {
    const res = await http.get<HateoasCollection<Movimentacao>>(`/movimentacoes/base/${baseId}`);
    return res.data._embedded?.movimentacaoListagemDTOList ?? [];
  },

  async listarPorUsuario(usuarioId: number): Promise<Movimentacao[]> {
    const res = await http.get<HateoasCollection<Movimentacao>>(`/movimentacoes/usuario/${usuarioId}`);
    return res.data._embedded?.movimentacaoListagemDTOList ?? [];
  },

  async registrar(data: MovimentacaoInput): Promise<Movimentacao> {
    const res = await http.post<Movimentacao>("/movimentacoes", data);
    return res.data;
  },
};