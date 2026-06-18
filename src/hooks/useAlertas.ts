import { Alerta } from "@/lib/types";
import { alertaService } from "@/services/alerta.service";
import { useEffect, useState } from "react";

export const useAlertas = (baseId?: number) => {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function carregar() {
    try {
      setIsLoading(true);
      setError(null);
      const data = baseId
        ? await alertaService.listarPorBase(baseId)
        : await alertaService.listarAtivos();
      setAlertas(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { carregar(); }, [baseId]);

  return { alertas, isLoading, error, recarregar: carregar };
};