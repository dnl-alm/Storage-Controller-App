import http from "@/lib/http";
import { HateoasCollection, Usuario } from "@/lib/types";

export const usuarioService = {
  async buscarPorId(id: number): Promise<Usuario> {
    const res = await http.get<Usuario>(`/usuarios/${id}`);
    return res.data;
  },

  async listarPorBase(baseId: number): Promise<Usuario[]> {
    const res = await http.get<HateoasCollection<Usuario>>(`/usuarios/base/${baseId}`);
    return res.data._embedded?.usuarioListagemDTOList ?? [];
  },

  async criar(
    data: { nome: string; email: string; senha: string; baseId: number },
    solicitanteId?: number
  ): Promise<Usuario> {
    const query = solicitanteId ? `?solicitanteId=${solicitanteId}` : "";
    const res = await http.post<Usuario>(`/usuarios${query}`, {
      ...data,
      tipoUsuario: "OPERATOR",
    });
    return res.data;
  },

  async atualizar(
    id: number,
    data: { nome: string; email: string; senha: string }
  ): Promise<Usuario> {
    const res = await http.put<Usuario>(`/usuarios/${id}`, data);
    return res.data;
  },

  async listarTodos(): Promise<Usuario[]> {
    const res = await http.get<HateoasCollection<Usuario>>("/usuarios");
    return res.data._embedded?.usuarioListagemDTOList ?? [];
  },

  async deletar(id: number): Promise<void> {
    await http.delete(`/usuarios/${id}`);
  },
};