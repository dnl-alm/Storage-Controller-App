import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="cadastro" />
        <Stack.Screen name="tabs" />
        <Stack.Screen
          name="recurso/[id]"
          options={{ headerShown: true, title: "Detalhes do Recurso", headerStyle: { backgroundColor: "#0f172a" }, headerTintColor: "#22d3ee" }}
        />
        <Stack.Screen
          name="recurso/novo"
          options={{ headerShown: true, title: "Novo Recurso", headerStyle: { backgroundColor: "#0f172a" }, headerTintColor: "#22d3ee" }}
        />
        <Stack.Screen
          name="recurso/editar/[id]"
          options={{ headerShown: true, title: "Editar Recurso", headerStyle: { backgroundColor: "#0f172a" }, headerTintColor: "#22d3ee" }}
        />
        <Stack.Screen
          name="movimentacao/nova"
          options={{ headerShown: true, title: "Nova Movimentação", headerStyle: { backgroundColor: "#0f172a" }, headerTintColor: "#22d3ee" }}
        />
        <Stack.Screen
          name="setor/novo"
          options={{ headerShown: true, title: "Novo Setor", headerStyle: { backgroundColor: "#0f172a" }, headerTintColor: "#22d3ee" }}
        />
        <Stack.Screen
          name="setor/editar/[id]"
          options={{ headerShown: true, title: "Editar Setor", headerStyle: { backgroundColor: "#0f172a" }, headerTintColor: "#22d3ee" }}
        />
      </Stack>
    </AuthProvider>
  );
}