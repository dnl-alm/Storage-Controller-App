import MyTextInput from "@/components/MyTextInput";
import { SetorInput, SetorSchema } from "@/schemas/setor.schema";
import { setorService } from "@/services/setor.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
  ScrollView, Text, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditarSetorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const { control, handleSubmit, reset } = useForm<SetorInput>({
    resolver: zodResolver(SetorSchema) as any,
  });

  useEffect(() => {
    async function carregar() {
      try {
        const setor = await setorService.buscarPorId(Number(id));
        reset({ baseId: setor.baseId, nome: setor.nome, descricao: setor.descricao ?? "" });
      } catch (e: any) {
        Alert.alert("Erro", e.message);
        router.back();
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [id]);

  const handleAtualizar = async (data: SetorInput): Promise<void> => {
    setIsLoading(true);
    try {
      await setorService.atualizar(Number(id), { nome: data.nome, descricao: data.descricao });
      Alert.alert("Sucesso", "Setor atualizado!", [{ text: "OK", onPress: () => router.back() }]);
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (carregando) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-950">
        <ActivityIndicator size={48} color="#22d3ee" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={["bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView className="flex-1 px-6" keyboardShouldPersistTaps="handled">
          <View className="pt-4 pb-8 gap-6">
            <MyTextInput name="nome" control={control} label="Nome do setor" placeholder="Ex: Laboratório" />
            <MyTextInput name="descricao" control={control} label="Descrição (opcional)" placeholder="Descreva o setor..." multiline numberOfLines={3} className="h-24" textAlignVertical="top" />
            <TouchableOpacity
              onPress={() => handleSubmit(handleAtualizar)()}
              disabled={isLoading}
              className="w-full h-14 bg-cyan-500/10 border border-cyan-500/40 rounded-xl items-center justify-center"
            >
              {isLoading ? <ActivityIndicator color="#22d3ee" /> : (
                <Text className="text-cyan-400 font-bold text-sm uppercase tracking-widest font-mono">Salvar Alterações</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}