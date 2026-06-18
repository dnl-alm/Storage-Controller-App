import { Movimentacao } from "@/lib/types";
import { movimentacaoService } from "@/services/movimentacao.service";
import { useEffect, useState } from "react";

export const useMovimentacoes = (baseId?: number) => {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function carregar() {
    try {
      setIsLoading(true);
      setError(null);
      const data = baseId
        ? await movimentacaoService.listarPorBase(baseId)
        : [];
      setMovimentacoes(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { carregar(); }, [baseId]);

  return { movimentacoes, isLoading, error, recarregar: carregar };
};