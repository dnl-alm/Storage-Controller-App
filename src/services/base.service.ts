import http from "@/lib/http";
import { Base, HateoasCollection } from "@/lib/types";

export const baseService = {
  async listar(): Promise<Base[]> {
    const res = await http.get<HateoasCollection<Base>>("/bases");
    return res.data._embedded?.baseListagemDTOList ?? [];
  },

  async buscarPorId(id: number): Promise<Base> {
    const res = await http.get<Base>(`/bases/${id}`);
    return res.data;
  },
};