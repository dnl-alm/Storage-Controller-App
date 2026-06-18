import MyTextInput from "@/components/MyTextInput";
import { useAuth } from "@/context/AuthContext";
import { PerfilInput, PerfilSchema } from "@/schemas/perfil.schema";
import { usuarioService } from "@/services/usuario.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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

export default function PerfilScreen() {
  const { usuario, login, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm<PerfilInput>({
    resolver: zodResolver(PerfilSchema),
    defaultValues: {
      nome: usuario?.nome ?? "",
      email: usuario?.email ?? "",
      senha: "",
    },
  });

  useEffect(() => {
    if (usuario) {
      reset({
        nome: usuario.nome,
        email: usuario.email,
        senha: "",
      });
    }
  }, [usuario]);

  const handleAtualizar = async (data: PerfilInput): Promise<void> => {
    if (!usuario) return;
    setIsLoading(true);
    try {
      const atualizado = await usuarioService.atualizar(usuario.id, {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
      });
      await login(atualizado);
      Alert.alert("Sucesso", "Perfil atualizado!");
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    } finally {
      setIsLoading(false);
    }
  };

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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="pt-4 pb-6 gap-1">
            <View className="flex-row items-center gap-2">
              <View className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <Text className="text-cyan-400 text-xs font-mono uppercase tracking-widest">
                Operador
              </Text>
            </View>
            <Text className="text-2xl font-black text-white uppercase tracking-tight">
              Perfil
            </Text>
            <Text className="text-slate-500 font-mono text-xs">
              Gerencie suas informações
            </Text>
          </View>

          <View className="h-px bg-slate-800 mb-6" />

          {/* Info card */}
          <View className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6 gap-4">
            <View className="flex-row items-center gap-4">
              <View className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/30 items-center justify-center">
                <Text className="text-2xl font-black text-cyan-400">
                  {usuario?.nome?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-white font-bold text-base">{usuario?.nome}</Text>
                <Text className="text-slate-500 text-xs font-mono">{usuario?.email}</Text>
              </View>
            </View>

            <View className="h-px bg-slate-800" />

            <View className="flex-row gap-2">
              <View className="bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-lg">
                <Text className="text-cyan-400 text-xs font-bold font-mono uppercase tracking-widest">
                  {usuario?.tipoUsuario}
                </Text>
              </View>
              <View className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg">
                <Text className="text-slate-400 text-xs font-bold font-mono uppercase tracking-widest">
                  Base #{usuario?.baseId}
                </Text>
              </View>
            </View>
          </View>

          {/* Form */}
          <View className="gap-5 pb-8">
            <View className="flex-row items-center gap-2 mb-1">
              <View className="w-1 h-4 bg-cyan-400 rounded-full" />
              <Text className="text-white font-bold text-xs uppercase tracking-widest font-mono">
                Editar Dados
              </Text>
            </View>

            <MyTextInput
              name="nome"
              control={control}
              label="Nome"
              placeholder="Seu nome"
            />
            <MyTextInput
              name="email"
              control={control}
              label="Email"
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <MyTextInput
              name="senha"
              control={control}
              label="Nova Senha"
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
            />

            <TouchableOpacity
              onPress={() => handleSubmit(handleAtualizar)()}
              disabled={isLoading}
              className="w-full h-14 bg-cyan-500/10 border border-cyan-500/40 rounded-xl items-center justify-center"
            >
              {isLoading ? (
                <ActivityIndicator color="#22d3ee" />
              ) : (
                <Text className="text-cyan-400 font-bold text-sm uppercase tracking-widest font-mono">
                  Salvar Alterações
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              className="w-full h-14 bg-red-500/10 border border-red-500/30 rounded-xl items-center justify-center"
            >
              <Text className="text-red-400 font-bold text-sm uppercase tracking-widest font-mono">
                Sair da Conta
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}