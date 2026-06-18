import CardAlerta from "@/components/CardAlerta";
import CardRecurso from "@/components/CardRecurso";
import { useAuth } from "@/context/AuthContext";
import { useAlertas } from "@/hooks/useAlertas";
import { useMovimentacoes } from "@/hooks/useMovimentacoes";
import { useRecursos } from "@/hooks/useRecursos";
import { alertaService } from "@/services/alerta.service";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  const { usuario, logout } = useAuth();
  const baseId = usuario?.baseId;

  const { recursos, isLoading: loadR, recarregar: recarregarR } = useRecursos(baseId);
  const { alertas, isLoading: loadA, recarregar: recarregarA } = useAlertas(baseId);
  const { movimentacoes, recarregar: recarregarM } = useMovimentacoes(baseId);

  const isLoading = loadR || loadA;
  const criticos = recursos.filter((r) => r.status === "CRITICO");
  const atencao = recursos.filter((r) => r.status === "ATENCAO");
  const ok = recursos.filter((r) => r.status === "OK");

  async function handleResolver(alertaId: number) {
    if (!usuario) return;
    try {
      await alertaService.resolver(alertaId, usuario.id);
      recarregarA();
      recarregarR();
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    }
  }

  function handleLogout() {
    Alert.alert("Sair", "Deseja encerrar a sessão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => { recarregarR(); recarregarA(); recarregarM(); }}
            tintColor="#22d3ee"
          />
        }
      >
        {/* Header */}
        <View className="pt-4 pb-5 flex-row justify-between items-start">
          <View className="gap-1">
            <View className="flex-row items-center gap-2">
              <View className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <Text className="text-cyan-400 text-xs font-mono uppercase tracking-widest">
                Sistema Online
              </Text>
            </View>
            <Text className="text-2xl font-black text-white uppercase tracking-tight">
              Central de Comando
            </Text>
            <Text className="text-slate-500 font-mono text-xs">
              {usuario?.nome} · Base #{baseId}
            </Text>
          </View>
          <View className="flex-row gap-2 pt-1">
            <TouchableOpacity
              onPress={() => router.push("/setor/novo")}
              className="flex-row items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-4 h-10 rounded-xl"
            >
              <MaterialIcons name="add" size={16} color="#22d3ee" />
              <Text className="text-cyan-400 text-xs font-bold font-mono uppercase tracking-wide">
                Setor
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogout}
              className="w-10 h-10 bg-red-500/10 border border-red-500/30 rounded-xl items-center justify-center"
            >
              <MaterialIcons name="logout" size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-px bg-slate-800 mb-5" />

        {/* Cards resumo */}
        <View className="flex-row gap-3 mb-5">
          <View className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 gap-1">
            <Text className="text-2xl font-black text-white font-mono">{recursos.length}</Text>
            <Text className="text-xs text-slate-500 uppercase tracking-widest">Recursos</Text>
          </View>
          <View className="flex-1 bg-slate-900 border border-red-500/20 rounded-xl p-3 gap-1">
            <Text className="text-2xl font-black text-red-400 font-mono">{criticos.length}</Text>
            <Text className="text-xs text-slate-500 uppercase tracking-widest">Críticos</Text>
          </View>
          <View className="flex-1 bg-slate-900 border border-yellow-400/20 rounded-xl p-3 gap-1">
            <Text className="text-2xl font-black text-yellow-400 font-mono">{atencao.length}</Text>
            <Text className="text-xs text-slate-500 uppercase tracking-widest">Atenção</Text>
          </View>
          <View className="flex-1 bg-slate-900 border border-cyan-500/20 rounded-xl p-3 gap-1">
            <Text className="text-2xl font-black text-cyan-400 font-mono">{ok.length}</Text>
            <Text className="text-xs text-slate-500 uppercase tracking-widest">OK</Text>
          </View>
        </View>

        {/* Alertas */}
        {alertas.length > 0 && (
          <View className="mb-5 gap-3">
            <View className="flex-row items-center gap-2">
              <View className="w-1 h-4 bg-red-500 rounded-full" />
              <Text className="text-white font-bold text-xs uppercase tracking-widest font-mono">
                Alertas Ativos
              </Text>
              <View className="bg-red-500/20 border border-red-500/30 px-2 py-0.5 rounded-full">
                <Text className="text-red-400 text-xs font-mono font-bold">{alertas.length}</Text>
              </View>
            </View>
            {alertas.slice(0, 3).map((a) => (
              <CardAlerta key={a.id} alerta={a} onResolver={() => handleResolver(a.id)} />
            ))}
            {alertas.length > 3 && (
              <TouchableOpacity onPress={() => router.push("/tabs/alertas")}>
                <Text className="text-cyan-400 text-center text-xs font-mono font-bold uppercase tracking-widest">
                  Ver todos ({alertas.length})
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Recursos críticos */}
        {criticos.length > 0 && (
          <View className="mb-5 gap-3">
            <View className="flex-row items-center gap-2">
              <View className="w-1 h-4 bg-yellow-400 rounded-full" />
              <Text className="text-white font-bold text-xs uppercase tracking-widest font-mono">
                Recursos Críticos
              </Text>
            </View>
            {criticos.map((r) => (
              <CardRecurso key={r.id} recurso={r} onPress={() => router.push(`/recurso/${r.id}`)} />
            ))}
          </View>
        )}

        {/* Movimentações recentes */}
        <View className="mb-8 gap-3">
          <View className="flex-row items-center gap-2">
            <View className="w-1 h-4 bg-slate-500 rounded-full" />
            <Text className="text-white font-bold text-xs uppercase tracking-widest font-mono">
              Movimentações Recentes
            </Text>
          </View>
          {movimentacoes.slice(0, 5).map((m) => (
            <View
              key={m.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-row justify-between items-center"
            >
              <View className="gap-1">
                <Text className="text-white font-bold text-sm">{m.recursoNome}</Text>
                <Text className="text-slate-500 text-xs font-mono">{m.setorNome}</Text>
              </View>
              <View className={`px-3 py-1 rounded-lg border ${
                m.tipoMovimentacao === "CONSUMO"
                  ? "bg-red-500/10 border-red-500/30"
                  : "bg-cyan-500/10 border-cyan-500/30"
              }`}>
                <Text className={`text-xs font-mono font-bold ${
                  m.tipoMovimentacao === "CONSUMO" ? "text-red-400" : "text-cyan-400"
                }`}>
                  {m.tipoMovimentacao === "CONSUMO" ? "-" : "+"}{m.quantidade}
                </Text>
              </View>
            </View>
          ))}
          {movimentacoes.length === 0 && (
            <View className="bg-slate-900 border border-slate-800 rounded-xl p-6 items-center">
              <Text className="text-slate-600 text-xs font-mono uppercase tracking-widest">
                Nenhuma movimentação
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}