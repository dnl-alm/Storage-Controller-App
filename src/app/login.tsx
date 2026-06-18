import MyTextInput from "@/components/MyTextInput";
import { useAuth } from "@/context/AuthContext";
import { LoginInput, LoginSchema } from "@/schemas/auth.schema";
import { usuarioService } from "@/services/usuario.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
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

export default function LoginScreen() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", senha: "" },
  });

  const handleLogin = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const usuarios = await usuarioService.listarTodos();
      const encontrado = usuarios.find((u) => u.email === data.email);
      if (!encontrado) {
        Alert.alert("Erro", "Usuário não encontrado com esse email.");
        return;
      }
      await login(encontrado);
      router.replace("/tabs/dashboard");
    } catch (e: any) {
      Alert.alert("Erro", e.message ?? "Falha ao conectar com o servidor.");
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
        >
          <View className="flex-1 px-8 justify-center gap-10">

            <View className="gap-2">
              <View className="flex-row items-center gap-2 mb-1">
                <View className="w-2 h-2 rounded-full bg-cyan-400" />
                <Text className="text-cyan-400 text-xs font-mono uppercase tracking-widest">
                  Sistema Online
                </Text>
              </View>
              <Text className="text-4xl font-black text-white tracking-tighter uppercase">
                STORAGE CONTROLLER
              </Text>
              <Text className="text-slate-500 font-mono text-sm">
                Gestão operacional de recursos
              </Text>
            </View>

            <View className="h-px bg-slate-800" />

            <View className="gap-5">
              <MyTextInput
                name="email"
                control={control}
                label="Email"
                placeholder="operador@base.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <MyTextInput
                name="senha"
                control={control}
                label="Senha"
                placeholder="••••••••"
                secureTextEntry
              />
              <TouchableOpacity
                onPress={handleSubmit(handleLogin)}
                disabled={isLoading}
                className="w-full h-14 bg-cyan-500/10 border border-cyan-500/40 rounded-xl items-center justify-center mt-2"
              >
                {isLoading ? (
                  <ActivityIndicator color="#22d3ee" />
                ) : (
                  <Text className="text-cyan-400 font-bold text-sm uppercase tracking-widest font-mono">
                    Acessar Sistema
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center gap-1">
              <Text className="text-slate-500 font-mono text-sm">Sem acesso?</Text>
              <TouchableOpacity onPress={() => router.push("/cadastro")}>
                <Text className="text-cyan-400 font-bold text-sm font-mono">Criar conta</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}