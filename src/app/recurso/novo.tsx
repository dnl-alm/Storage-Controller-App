import MyTextInput from "@/components/MyTextInput";
import { useAuth } from "@/context/AuthContext";
import { useSetores } from "@/hooks/useSetores";
import { RecursoInput, RecursoSchema } from "@/schemas/recurso.schema";
import { recursoService } from "@/services/recurso.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NovoRecursoScreen() {
  const { usuario } = useAuth();
  const { setores, isLoading: loadingSetores } = useSetores(usuario?.baseId);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, setValue, watch } = useForm<RecursoInput>({
  resolver: zodResolver(RecursoSchema) as any,
  defaultValues: { critico: false },
});

  const setorSelecionado = watch("setorId");
  const critico = watch("critico");

  const handleCriar = async (data: RecursoInput): Promise<void> => {
    if (!usuario) return;
    setIsLoading(true);
    try {
      await recursoService.criar(data, usuario.id);
      Alert.alert("Sucesso", "Recurso criado!", [
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

            <MyTextInput
              name="nome"
              control={control}
              label="Nome do recurso"
              placeholder="Ex: Água Potável"
            />

            <MyTextInput
              name="categoria"
              control={control}
              label="Categoria"
              placeholder="Ex: Líquidos"
            />

            <View className="flex-row gap-3">
              <View className="flex-1">
                <MyTextInput
                  name="quantidade"
                  control={control}
                  label="Quantidade"
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <MyTextInput
                  name="minimo"
                  control={control}
                  label="Mínimo"
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <MyTextInput
              name="capacidadeMaxima"
              control={control}
              label="Capacidade Máxima"
              placeholder="0"
              keyboardType="numeric"
            />

            {/* Setor */}
            <View className="gap-2">
              <Text className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                Setor
              </Text>
              {loadingSetores ? (
                <ActivityIndicator color="#516200" />
              ) : (
                <View className="gap-2">
                  {setores.map((s) => (
                    <TouchableOpacity
                      key={s.id}
                      onPress={() => setValue("setorId", s.id)}
                      className={`h-12 px-4 rounded-xl items-center justify-center border-2 ${
                        setorSelecionado === s.id
                          ? "bg-primary-container/20 border-primary"
                          : "bg-surface-container-lowest border-transparent"
                      }`}
                    >
                      <Text
                        className={`font-bold text-sm ${
                          setorSelecionado === s.id ? "text-primary" : "text-on-surface"
                        }`}
                      >
                        {s.nome}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <Controller
                    control={control}
                    name="setorId"
                    render={({ fieldState: { error } }) => (
                      <>
                        {error && (
                          <Text className="text-red-400 text-xs ml-1">
                            {error.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                </View>
              )}
            </View>

            {/* Crítico */}
            <View className="flex-row justify-between items-center bg-surface-container-low p-4 rounded-xl">
              <View className="gap-1">
                <Text className="text-on-surface font-bold">Recurso crítico</Text>
                <Text className="text-on-surface-variant text-xs">
                  Gera alertas ao atingir o mínimo
                </Text>
              </View>
              <Switch
                value={critico}
                onValueChange={(v) => setValue("critico", v)}
                trackColor={{ false: "#3f3f3f", true: "#516200" }}
                thumbColor={critico ? "#d3fb00" : "#9ca3af"}
              />
            </View>

            <TouchableOpacity
              onPress={() => handleSubmit(handleCriar)()}
              disabled={isLoading}
              className="w-full h-14 bg-primary rounded-2xl items-center justify-center"
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-on-primary font-bold text-base uppercase tracking-widest">
                  Criar Recurso
                </Text>
              )}
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}