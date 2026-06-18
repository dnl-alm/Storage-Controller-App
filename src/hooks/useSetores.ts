import { Setor } from "@/lib/types";
import { setorService } from "@/services/setor.service";
import { useEffect, useState } from "react";

export const useSetores = (baseId?: number) => {
  const [setores, setSetores] = useState<Setor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function carregar() {
    try {
      setIsLoading(true);
      setError(null);
      const data = baseId
        ? await setorService.listarPorBase(baseId)
        : await setorService.listar();
      setSetores(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { carregar(); }, [baseId]);

  return { setores, isLoading, error, recarregar: carregar };
};