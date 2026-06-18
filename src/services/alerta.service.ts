import http from "@/lib/http";
import { Alerta, HateoasCollection } from "@/lib/types";

export const alertaService = {
  async listarAtivos(): Promise<Alerta[]> {
    const res = await http.get<HateoasCollection<Alerta>>("/alertas");
    return res.data._embedded?.alertaListagemDTOList ?? [];
  },

  async listarPorBase(baseId: number): Promise<Alerta[]> {
    const res = await http.get<HateoasCollection<Alerta>>(`/alertas/base/${baseId}`);
    return res.data._embedded?.alertaListagemDTOList ?? [];
  },

  async listarPorSetor(setorId: number): Promise<Alerta[]> {
    const res = await http.get<HateoasCollection<Alerta>>(`/alertas/setor/${setorId}`);
    return res.data._embedded?.alertaListagemDTOList ?? [];
  },

  async resolver(id: number, usuarioId: number): Promise<Alerta> {
    const res = await http.patch<Alerta>(`/alertas/${id}/resolver?usuarioId=${usuarioId}`);
    return res.data;
  },
};