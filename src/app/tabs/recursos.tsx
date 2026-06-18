import CardRecurso from "@/components/CardRecurso";
import { useAuth } from "@/context/AuthContext";
import { useRecursos } from "@/hooks/useRecursos";
import { StatusRecurso } from "@/lib/types";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FILTROS: { label: string; value: StatusRecurso | "TODOS" }[] = [
  { label: "TODOS", value: "TODOS" },
  { label: "OK", value: "OK" },
  { label: "ATENÇÃO", value: "ATENCAO" },
  { label: "CRÍTICO", value: "CRITICO" },
];

const filtroAtivo: Record<string, string> = {
  TODOS:   "bg-slate-700 border-slate-600",
  OK:      "bg-cyan-500/10 border-cyan-500/40",
  ATENCAO: "bg-yellow-400/10 border-yellow-400/40",
  CRITICO: "bg-red-500/10 border-red-500/40",
};

const filtroTexto: Record<string, string> = {
  TODOS:   "text-white",
  OK:      "text-cyan-400",
  ATENCAO: "text-yellow-400",
  CRITICO: "text-red-400",
};

export default function RecursosScreen() {
  const { usuario } = useAuth();
  const { recursos, isLoading, recarregar } = useRecursos(usuario?.baseId);
  const [filtro, setFiltro] = useState<StatusRecurso | "TODOS">("TODOS");

  const filtrados = filtro === "TODOS" ? recursos : recursos.filter((r) => r.status === filtro);

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={recarregar} tintColor="#22d3ee" />}
      >
        <View className="pt-4 pb-4 flex-row justify-between items-center">
          <View className="gap-1">
            <Text className="text-2xl font-black text-white uppercase tracking-tight">Recursos</Text>
            <Text className="text-slate-500 font-mono text-xs">{filtrados.length} registros</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/recurso/novo")}
            className="flex-row items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-4 h-10 rounded-xl"
          >
            <MaterialIcons name="add" size={16} color="#22d3ee" />
            <Text className="text-cyan-400 text-xs font-bold font-mono uppercase tracking-wide">
              Novo
            </Text>
          </TouchableOpacity>
        </View>

        <View className="h-px bg-slate-800 mb-4" />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row gap-2">
            {FILTROS.map((f) => (
              <TouchableOpacity
                key={f.value}
                onPress={() => setFiltro(f.value)}
                className={`px-4 py-2 rounded-lg border ${
                  filtro === f.value ? filtroAtivo[f.value] : "bg-slate-900 border-slate-800"
                }`}
              >
                <Text className={`text-xs font-bold font-mono ${
                  filtro === f.value ? filtroTexto[f.value] : "text-slate-500"
                }`}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View className="gap-3 pb-8">
          {filtrados.map((r) => (
            <CardRecurso key={r.id} recurso={r} onPress={() => router.push(`/recurso/${r.id}`)} />
          ))}
          {filtrados.length === 0 && !isLoading && (
            <View className="bg-slate-900 border border-slate-800 rounded-xl p-8 items-center">
              <Text className="text-slate-600 text-xs font-mono uppercase tracking-widest">
                Nenhum recurso encontrado
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}