import MyTextInput from "@/components/MyTextInput";
import { useAuth } from "@/context/AuthContext";
import { SetorInput, SetorSchema } from "@/schemas/setor.schema";
import { setorService } from "@/services/setor.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
  ScrollView, Text, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NovoSetorScreen() {
  const { usuario } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm<SetorInput>({
    resolver: zodResolver(SetorSchema) as any,
    defaultValues: { baseId: usuario?.baseId },
  });

  const handleCriar = async (data: SetorInput): Promise<void> => {
    setIsLoading(true);
    try {
      await setorService.criar(data);
      Alert.alert("Sucesso", "Setor criado!", [{ text: "OK", onPress: () => router.back() }]);
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={["bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView className="flex-1 px-6" keyboardShouldPersistTaps="handled">
          <View className="pt-4 pb-8 gap-6">
            <Text className="text-slate-500 font-mono text-xs uppercase tracking-widest">
              Base #{usuario?.baseId}
            </Text>
            <MyTextInput name="nome" control={control} label="Nome do setor" placeholder="Ex: Laboratório" />
            <MyTextInput name="descricao" control={control} label="Descrição (opcional)" placeholder="Descreva o setor..." multiline numberOfLines={3} className="h-24" textAlignVertical="top" />
            <TouchableOpacity
              onPress={() => handleSubmit(handleCriar)()}
              disabled={isLoading}
              className="w-full h-14 bg-cyan-500/10 border border-cyan-500/40 rounded-xl items-center justify-center"
            >
              {isLoading ? <ActivityIndicator color="#22d3ee" /> : (
                <Text className="text-cyan-400 font-bold text-sm uppercase tracking-widest font-mono">Criar Setor</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}