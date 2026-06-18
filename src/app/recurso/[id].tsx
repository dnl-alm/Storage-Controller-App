import BarraCapacidade from "@/components/BarraCapacidade";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { Recurso } from "@/lib/types";
import { movimentacaoService } from "@/services/movimentacao.service";
import { recursoService } from "@/services/recurso.service";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecursoDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { usuario } = useAuth();
  const [recurso, setRecurso] = useState<Recurso | null>(null);
  const [movimentacoes, setMovimentacoes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function carregar() {
    try {
      setIsLoading(true);
      const [r, movs] = await Promise.all([
        recursoService.buscarPorId(Number(id)),
        movimentacaoService.listarPorRecurso(Number(id)),
      ]);
      setRecurso(r);
      setMovimentacoes(movs);
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { carregar(); }, [id]);

  async function handleDeletar() {
    if (!usuario || !recurso) return;
    Alert.alert("Confirmar", `Deletar "${recurso.nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          try {
            await recursoService.deletar(recurso.id, usuario.id);
            router.back();
          } catch (e: any) {
            Alert.alert("Erro", e.message);
          }
        },
      },
    ]);
  }

  if (isLoading || !recurso) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-950">
        <ActivityIndicator size={48} color="#22d3ee" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={["bottom"]}>
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={carregar} tintColor="#22d3ee" />}
      >
        {/* Info principal */}
        <View className="pt-4 pb-6 gap-4">
          <View className="flex-row justify-between items-start">
            <View className="flex-1 gap-1">
              <Text className="text-2xl font-black text-white">{recurso.nome}</Text>
              <Text className="text-slate-500 font-mono text-xs">{recurso.categoria} · {recurso.setorNome}</Text>
            </View>
            <StatusBadge status={recurso.status} />
          </View>

          {/* Barra capacidade */}
          <View className="bg-slate-900 border border-slate-800 rounded-xl p-4 gap-3">
            <BarraCapacidade
              quantidade={recurso.quantidade}
              capacidadeMaxima={recurso.capacidadeMaxima}
              status={recurso.status}
            />
            <View className="flex-row justify-between">
              <View className="items-center gap-1">
                <Text className="text-slate-500 text-xs font-mono">Atual</Text>
                <Text className="text-white font-bold font-mono">{recurso.quantidade}</Text>
              </View>
              <View className="items-center gap-1">
                <Text className="text-slate-500 text-xs font-mono">Mínimo</Text>
                <Text className="text-yellow-400 font-bold font-mono">{recurso.minimo}</Text>
              </View>
              <View className="items-center gap-1">
                <Text className="text-slate-500 text-xs font-mono">Máximo</Text>
                <Text className="text-white font-bold font-mono">{recurso.capacidadeMaxima}</Text>
              </View>
            </View>
          </View>

          {/* Ações */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push({
                pathname: "/movimentacao/nova",
                params: { recursoId: recurso.id },
              })}
              className="flex-1 bg-cyan-500/10 border border-cyan-500/30 h-12 rounded-xl items-center justify-center flex-row gap-2"
            >
              <MaterialIcons name="swap-horiz" size={16} color="#22d3ee" />
              <Text className="text-cyan-400 font-bold text-xs font-mono uppercase tracking-wide">
                Movimentar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push(`/recurso/editar/${recurso.id}`)}
              className="flex-row items-center gap-2 bg-slate-800 border border-slate-700 px-4 h-12 rounded-xl"
            >
              <MaterialIcons name="edit" size={16} color="#94a3b8" />
              <Text className="text-slate-400 font-bold text-xs font-mono uppercase tracking-wide">
                Editar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDeletar}
              className="flex-row items-center gap-2 bg-red-500/10 border border-red-500/30 px-4 h-12 rounded-xl"
            >
              <MaterialIcons name="delete-outline" size={16} color="#ef4444" />
              <Text className="text-red-400 font-bold text-xs font-mono uppercase tracking-wide">
                Deletar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Histórico */}
        <View className="pb-8 gap-3">
          <View className="flex-row items-center gap-2">
            <View className="w-1 h-4 bg-slate-500 rounded-full" />
            <Text className="text-white font-bold text-xs uppercase tracking-widest font-mono">
              Histórico
            </Text>
          </View>
          {movimentacoes.slice(0, 10).map((m) => (
            <View
              key={m.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex-row justify-between items-center"
            >
              <View className="gap-1">
                <Text className={`text-xs font-bold font-mono ${
                  m.tipoMovimentacao === "CONSUMO" ? "text-red-400" : "text-cyan-400"
                }`}>
                  {m.tipoMovimentacao}
                </Text>
                <Text className="text-slate-600 text-xs font-mono">
                  {new Date(m.dataMovimentacao).toLocaleString("pt-BR")}
                </Text>
              </View>
              <Text className={`font-black font-mono ${
                m.tipoMovimentacao === "CONSUMO" ? "text-red-400" : "text-cyan-400"
              }`}>
                {m.tipoMovimentacao === "CONSUMO" ? "-" : "+"}{m.quantidade}
              </Text>
            </View>
          ))}
          {movimentacoes.length === 0 && (
            <View className="bg-slate-900 border border-slate-800 rounded-xl p-6 items-center">
              <Text className="text-slate-600 text-xs font-mono uppercase tracking-widest">
                Sem histórico
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}