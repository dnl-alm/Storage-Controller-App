import { Usuario } from "@/lib/types";
import { usuarioService } from "@/services/usuario.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "@m5storage:usuario";

type AuthContextType = {
  usuario: Usuario | null;
  isLoading: boolean;
  login: (usuario: Usuario) => Promise<void>;
  logout: () => Promise<void>;
  refreshUsuario: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarUsuario();
  }, []);

  async function carregarUsuario() {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) setUsuario(JSON.parse(json));
    } catch {
    } finally {
      setIsLoading(false);
    }
  }

  async function login(u: Usuario) {
    setUsuario(u);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  }

  async function logout() {
    setUsuario(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  async function refreshUsuario() {
    if (!usuario) return;
    try {
      const atualizado = await usuarioService.buscarPorId(usuario.id);
      setUsuario(atualizado);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(atualizado));
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ usuario, isLoading, login, logout, refreshUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
};