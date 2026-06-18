import { useAuth } from "@/context/AuthContext";
import { useMovimentacoes } from "@/hooks/useMovimentacoes";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MovimentacoesScreen() {
  const { usuario } = useAuth();
  const { movimentacoes, isLoading, recarregar } = useMovimentacoes(usuario?.baseId);

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={recarregar} tintColor="#22d3ee" />}
      >
        <View className="pt-4 pb-4 flex-row justify-between items-center">
          <View className="gap-1">
            <Text className="text-2xl font-black text-white uppercase tracking-tight">Movimentações</Text>
            <Text className="text-slate-500 font-mono text-xs">{movimentacoes.length} registros</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/movimentacao/nova")}
            className="flex-row items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-4 h-10 rounded-xl"
          >
            <MaterialIcons name="add" size={16} color="#22d3ee" />
            <Text className="text-cyan-400 text-xs font-bold font-mono uppercase tracking-wide">
              Registrar
            </Text>
          </TouchableOpacity>
        </View>

        <View className="h-px bg-slate-800 mb-4" />

        <View className="gap-3 pb-8">
          {movimentacoes.map((m) => (
            <View key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 gap-3">
              <View className="flex-row justify-between items-start">
                <View className="flex-1 gap-1">
                  <Text className="text-white font-bold text-sm">{m.recursoNome}</Text>
                  <Text className="text-slate-500 text-xs font-mono">{m.setorNome}</Text>
                  <Text className="text-slate-600 text-xs font-mono">op: {m.usuarioNome}</Text>
                </View>
                <View className="items-end gap-2">
                  <View className={`px-3 py-1 rounded-lg border ${
                    m.tipoMovimentacao === "CONSUMO"
                      ? "bg-red-500/10 border-red-500/30"
                      : "bg-cyan-500/10 border-cyan-500/30"
                  }`}>
                    <Text className={`text-xs font-mono font-bold ${
                      m.tipoMovimentacao === "CONSUMO" ? "text-red-400" : "text-cyan-400"
                    }`}>
                      {m.tipoMovimentacao}
                    </Text>
                  </View>
                  <Text className={`text-lg font-black font-mono ${
                    m.tipoMovimentacao === "CONSUMO" ? "text-red-400" : "text-cyan-400"
                  }`}>
                    {m.tipoMovimentacao === "CONSUMO" ? "-" : "+"}{m.quantidade}
                  </Text>
                </View>
              </View>
              {m.descricao && (
                <Text className="text-slate-500 text-xs font-mono border-t border-slate-800 pt-2">
                  {m.descricao}
                </Text>
              )}
              <Text className="text-slate-600 text-xs font-mono">
                {new Date(m.dataMovimentacao).toLocaleString("pt-BR")}
              </Text>
            </View>
          ))}
          {movimentacoes.length === 0 && !isLoading && (
            <View className="bg-slate-900 border border-slate-800 rounded-xl p-8 items-center">
              <Text className="text-slate-600 text-xs font-mono uppercase tracking-widest">
                Nenhuma movimentação registrada
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}