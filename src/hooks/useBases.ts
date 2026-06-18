import { Base } from "@/lib/types";
import { baseService } from "@/services/base.service";
import { useEffect, useState } from "react";

export const useBases = () => {
  const [bases, setBases] = useState<Base[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function carregar() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await baseService.listar();
      setBases(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  return { bases, isLoading, error, recarregar: carregar };
};