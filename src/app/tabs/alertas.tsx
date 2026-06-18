import CardAlerta from "@/components/CardAlerta";
import { useAuth } from "@/context/AuthContext";
import { useAlertas } from "@/hooks/useAlertas";
import { alertaService } from "@/services/alerta.service";
import { Alert, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AlertasScreen() {
  const { usuario } = useAuth();
  const { alertas, isLoading, recarregar } = useAlertas(usuario?.baseId);

  async function handleResolver(alertaId: number) {
    if (!usuario) return;
    try {
      await alertaService.resolver(alertaId, usuario.id);
      recarregar();
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={recarregar} tintColor="#22d3ee" />}
      >
        <View className="pt-4 pb-4 gap-1">
          <Text className="text-2xl font-black text-white uppercase tracking-tight">Alertas</Text>
          <View className="flex-row items-center gap-2">
            <View className={`w-2 h-2 rounded-full ${alertas.length > 0 ? "bg-red-500" : "bg-cyan-400"}`} />
            <Text className="text-slate-500 font-mono text-xs">
              {alertas.length} alerta{alertas.length !== 1 ? "s" : ""} ativo{alertas.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        <View className="h-px bg-slate-800 mb-4" />

        <View className="gap-3 pb-8">
          {alertas.map((a) => (
            <CardAlerta key={a.id} alerta={a} onResolver={() => handleResolver(a.id)} />
          ))}
          {alertas.length === 0 && !isLoading && (
            <View className="bg-slate-900 border border-cyan-500/20 rounded-xl p-10 items-center gap-3">
              <View className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 items-center justify-center">
                <Text className="text-2xl">✓</Text>
              </View>
              <Text className="text-white font-bold">Tudo operacional</Text>
              <Text className="text-slate-500 text-xs font-mono text-center uppercase tracking-widest">
                Nenhum alerta ativo
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}