import MyTextInput from "@/components/MyTextInput";
import { useAuth } from "@/context/AuthContext";
import { useBases } from "@/hooks/useBases";
import { CadastroInput, CadastroSchema } from "@/schemas/auth.schema";
import { usuarioService } from "@/services/usuario.service";
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
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CadastroScreen() {
  const { login } = useAuth();
  const { bases, isLoading: loadingBases } = useBases();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, setValue, watch } = useForm<CadastroInput>({
    resolver: zodResolver(CadastroSchema) as any,
    defaultValues: { nome: "", email: "", senha: "" },
  });

  const baseSelecionada = watch("baseId");

  const handleCadastro = async (data: CadastroInput): Promise<void> => {
    setIsLoading(true);
    try {
      const novo = await usuarioService.criar({
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        baseId: data.baseId,
      });
      await login(novo);
      router.replace("/tabs/dashboard");
    } catch (e: any) {
      Alert.alert("Erro", e.message ?? "Falha ao cadastrar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="px-8"
        >
          <View className="pt-8 pb-6 gap-2">
            <TouchableOpacity onPress={() => router.back()} className="mb-2">
              <Text className="text-cyan-400 font-mono text-sm">← Voltar</Text>
            </TouchableOpacity>
            <Text className="text-3xl font-black text-white uppercase tracking-tight">
              Criar Conta
            </Text>
            <Text className="text-slate-500 font-mono text-xs uppercase tracking-widest">
              Acesso como Operator
            </Text>
          </View>

          <View className="h-px bg-slate-800 mb-6" />

          <View className="gap-5 pb-12">
            <MyTextInput name="nome" control={control} label="Nome completo" placeholder="Nome do operador" />
            <MyTextInput name="email" control={control} label="Email" placeholder="operador@base.com" keyboardType="email-address" autoCapitalize="none" />
            <MyTextInput name="senha" control={control} label="Senha" placeholder="Mínimo 6 caracteres" secureTextEntry />

            <View className="gap-2">
              <Text className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 font-mono">
                Base
              </Text>
              {loadingBases ? (
                <ActivityIndicator color="#22d3ee" />
              ) : (
                <View className="gap-2">
                  {bases.map((base) => (
                    <TouchableOpacity
                      key={base.id}
                      onPress={() => setValue("baseId", base.id)}
                      className={`h-14 px-5 rounded-xl items-center justify-center border ${
                        baseSelecionada === base.id
                          ? "bg-cyan-500/10 border-cyan-500/40"
                          : "bg-slate-900 border-slate-800"
                      }`}
                    >
                      <Text className={`font-bold font-mono text-sm ${
                        baseSelecionada === base.id ? "text-cyan-400" : "text-slate-400"
                      }`}>
                        {base.nome}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <Controller
                    control={control}
                    name="baseId"
                    render={({ fieldState: { error } }) => (
                      <>{error && <Text className="text-red-400 text-xs ml-1 font-mono">{error.message}</Text>}</>
                    )}
                  />
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={() => handleSubmit(handleCadastro)()}
              disabled={isLoading}
              className="w-full h-14 bg-cyan-500/10 border border-cyan-500/40 rounded-xl items-center justify-center mt-2"
            >
              {isLoading ? (
                <ActivityIndicator color="#22d3ee" />
              ) : (
                <Text className="text-cyan-400 font-bold text-sm uppercase tracking-widest font-mono">
                  Criar Conta
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}