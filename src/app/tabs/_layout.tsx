import { useAuth } from "@/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";

export default function TabsLayout() {
  const { usuario } = useAuth();

  if (!usuario) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#020617",
          borderTopColor: "#0f172a",
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#22d3ee",
        tabBarInactiveTintColor: "#334155",
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: "700",
          letterSpacing: 1.5,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "COMANDO",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="dashboard" size={focused ? 24 : 20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recursos"
        options={{
          title: "RECURSOS",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="inventory-2" size={focused ? 24 : 20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="movimentacoes"
        options={{
          title: "MOVIMENT.",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="swap-horiz" size={focused ? 24 : 20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alertas"
        options={{
          title: "ALERTAS",
          tabBarActiveTintColor: "#ef4444",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="notifications" size={focused ? 24 : 20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="historico"
        options={{
          title: "HISTÓRICO",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="history" size={focused ? 24 : 20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "PERFIL",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="person" size={focused ? 24 : 20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}