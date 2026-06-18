import { useAuth } from "@/context/AuthContext";
import { useMovimentacoes } from "@/hooks/useMovimentacoes";
import { TipoMovimentacao } from "@/lib/types";
import { useState } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FILTROS: { label: string; value: TipoMovimentacao | "TODOS" }[] = [
  { label: "TODOS", value: "TODOS" },
  { label: "CONSUMO", value: "CONSUMO" },
  { label: "REABAST.", value: "REABASTECIMENTO" },
];

export default function HistoricoScreen() {
  const { usuario } = useAuth();
  const { movimentacoes, isLoading, recarregar } = useMovimentacoes(usuario?.baseId);
  const [filtro, setFiltro] = useState<TipoMovimentacao | "TODOS">("TODOS");

  const filtradas = filtro === "TODOS"
    ? movimentacoes
    : movimentacoes.filter((m) => m.tipoMovimentacao === filtro);

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={recarregar} tintColor="#22d3ee" />}
      >
        <View className="pt-4 pb-4 gap-1">
          <Text className="text-2xl font-black text-white uppercase tracking-tight">Histórico</Text>
          <Text className="text-slate-500 font-mono text-xs">{filtradas.length} registros</Text>
        </View>

        <View className="h-px bg-slate-800 mb-4" />

        <View className="flex-row gap-2 mb-4">
          {FILTROS.map((f) => (
            <TouchableOpacity
              key={f.value}
              onPress={() => setFiltro(f.value)}
              className={`px-3 py-2 rounded-lg border ${
                filtro === f.value
                  ? "bg-cyan-500/10 border-cyan-500/40"
                  : "bg-slate-900 border-slate-800"
              }`}
            >
              <Text className={`text-xs font-bold font-mono ${
                filtro === f.value ? "text-cyan-400" : "text-slate-500"
              }`}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="gap-3 pb-8">
          {filtradas.map((m) => (
            <View key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-row gap-3 items-center">
              <View className={`w-10 h-10 rounded-xl items-center justify-center border ${
                m.tipoMovimentacao === "CONSUMO"
                  ? "bg-red-500/10 border-red-500/30"
                  : "bg-cyan-500/10 border-cyan-500/30"
              }`}>
                <Text className={`text-base font-black font-mono ${
                  m.tipoMovimentacao === "CONSUMO" ? "text-red-400" : "text-cyan-400"
                }`}>
                  {m.tipoMovimentacao === "CONSUMO" ? "−" : "+"}
                </Text>
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-white font-bold text-sm">{m.recursoNome}</Text>
                <Text className="text-slate-500 text-xs font-mono">{m.setorNome} · {m.usuarioNome}</Text>
                <Text className="text-slate-600 text-xs font-mono">
                  {new Date(m.dataMovimentacao).toLocaleString("pt-BR")}
                </Text>
                {m.descricao && (
                  <Text className="text-slate-500 text-xs font-mono italic">{m.descricao}</Text>
                )}
              </View>
              <Text className={`font-black text-base font-mono ${
                m.tipoMovimentacao === "CONSUMO" ? "text-red-400" : "text-cyan-400"
              }`}>
                {m.quantidade}
              </Text>
            </View>
          ))}
          {filtradas.length === 0 && !isLoading && (
            <View className="bg-slate-900 border border-slate-800 rounded-xl p-8 items-center">
              <Text className="text-slate-600 text-xs font-mono uppercase tracking-widest">
                Nenhum registro encontrado
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}