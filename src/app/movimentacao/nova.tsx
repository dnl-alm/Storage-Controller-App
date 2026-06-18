import MyTextInput from "@/components/MyTextInput";
import { useAuth } from "@/context/AuthContext";
import { useRecursos } from "@/hooks/useRecursos";
import { TipoMovimentacao } from "@/lib/types";
import { MovimentacaoInput, MovimentacaoSchema } from "@/schemas/movimentacao.schema";
import { movimentacaoService } from "@/services/movimentacao.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TIPOS: { label: string; value: TipoMovimentacao; cor: string; corText: string }[] = [
  { label: "Consumo", value: "CONSUMO", cor: "bg-red-500/20 border-red-500", corText: "text-red-400" },
  { label: "Reabastecimento", value: "REABASTECIMENTO", cor: "bg-green-500/20 border-green-500", corText: "text-green-400" },
];

export default function NovaMovimentacaoScreen() {
  const { usuario } = useAuth();
  const { recursoId } = useLocalSearchParams<{ recursoId?: string }>();
  const { recursos, isLoading: loadingRecursos } = useRecursos(usuario?.baseId);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, setValue, watch } = useForm<MovimentacaoInput>({
    resolver: zodResolver(MovimentacaoSchema) as any,
    defaultValues: {
      usuarioId: usuario?.id,
      tipoMovimentacao: "CONSUMO",
      recursoId: recursoId ? Number(recursoId) : undefined,
    },
  });

  const tipoSelecionado = watch("tipoMovimentacao");
  const recursoSelecionado = watch("recursoId");

  const handleRegistrar = async (data: MovimentacaoInput): Promise<void> => {
    setIsLoading(true);
    try {
      await movimentacaoService.registrar(data);
      Alert.alert("Sucesso", "Movimentação registrada!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6" keyboardShouldPersistTaps="handled">
          <View className="pt-4 pb-8 gap-6">

            {/* Tipo */}
            <View className="gap-2">
              <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                Tipo
              </Text>
              <View className="flex-row gap-3">
                {TIPOS.map((t) => (
                  <TouchableOpacity
                    key={t.value}
                    onPress={() => setValue("tipoMovimentacao", t.value)}
                    className={`flex-1 h-14 rounded-xl items-center justify-center border-2 ${
                      tipoSelecionado === t.value
                        ? t.cor
                        : "bg-surface-container-lowest border-transparent"
                    }`}
                  >
                    <Text className={`font-bold ${
                      tipoSelecionado === t.value ? t.corText : "text-on-surface"
                    }`}>
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Recurso */}
            <View className="gap-2">
              <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                Recurso
              </Text>
              {loadingRecursos ? (
                <ActivityIndicator color="#516200" />
              ) : (
                <View className="gap-2">
                  {recursos.map((r) => (
                    <TouchableOpacity
                      key={r.id}
                      onPress={() => setValue("recursoId", r.id)}
                      className={`p-4 rounded-xl border-2 flex-row justify-between items-center ${
                        recursoSelecionado === r.id
                          ? "bg-primary-container/20 border-primary"
                          : "bg-surface-container-lowest border-transparent"
                      }`}
                    >
                      <View>
                        <Text className={`font-bold text-sm ${
                          recursoSelecionado === r.id ? "text-primary" : "text-on-surface"
                        }`}>
                          {r.nome}
                        </Text>
                        <Text className="text-on-surface-variant text-xs">{r.setorNome}</Text>
                      </View>
                      <Text className="text-on-surface-variant text-xs">
                        {r.quantidade}/{r.capacidadeMaxima}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <Controller
                    control={control}
                    name="recursoId"
                    render={({ fieldState: { error } }) => (
                      <>
                        {error && (
                          <Text className="text-red-400 text-xs ml-1">{error.message}</Text>
                        )}
                      </>
                    )}
                  />
                </View>
              )}
            </View>

            {/* Quantidade */}
            <Controller
              control={control}
              name="quantidade"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View className="gap-1">
                  <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                    Quantidade
                  </Text>
                  <View className={`flex-row h-14 rounded-xl overflow-hidden border-2 ${
                    error ? "border-red-400" : "border-transparent"
                  } bg-surface-container-lowest`}>
                    <TouchableOpacity
                      onPress={() => onChange(Math.max(0, (Number(value) || 0) - 1))}
                      className="w-14 items-center justify-center"
                    >
                      <Text className="text-on-surface text-xl font-bold">−</Text>
                    </TouchableOpacity>

                    <TextInput
                      value={value?.toString() ?? "0"}
                      onChangeText={(v) => {
                        const num = v.replace(/[^0-9]/g, "");
                        onChange(num === "" ? 0 : Number(num));
                      }}
                      keyboardType="numeric"
                      textAlign="center"
                      placeholderTextColor="#9ca3af"
                      className="flex-1 text-on-surface font-bold text-lg text-center"
                    />

                    <TouchableOpacity
                      onPress={() => onChange((Number(value) || 0) + 1)}
                      className="w-14 items-center justify-center"
                    >
                      <Text className="text-on-surface text-xl font-bold">+</Text>
                    </TouchableOpacity>
                  </View>
                  {error && (
                    <Text className="text-red-400 text-xs ml-1">{error.message}</Text>
                  )}
                </View>
              )}
            />

            {/* Descrição */}
            <MyTextInput
              name="descricao"
              control={control}
              label="Observação (opcional)"
              placeholder="Motivo da movimentação..."
              multiline
              numberOfLines={3}
              className="h-24"
              textAlignVertical="top"
            />

            {/* Botão */}
            <TouchableOpacity
              onPress={() => handleSubmit(handleRegistrar)()}
              disabled={isLoading}
              className="w-full h-14 bg-primary rounded-2xl items-center justify-center"
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-on-primary font-bold text-base uppercase tracking-widest">
                  Registrar
                </Text>
              )}
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}