import { Recurso } from "@/lib/types";
import { recursoService } from "@/services/recurso.service";
import { useEffect, useState } from "react";

export const useRecursos = (baseId?: number) => {
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function carregar() {
    try {
      setIsLoading(true);
      setError(null);
      const data = baseId
        ? await recursoService.listarPorBase(baseId)
        : await recursoService.listar();
      setRecursos(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { carregar(); }, [baseId]);

  return { recursos, isLoading, error, recarregar: carregar };
};