import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { usuario, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-surface">
        <ActivityIndicator size={64} color="#516200" />
      </View>
    );
  }

  return <Redirect href={usuario ? "/tabs/dashboard" : "/login"} />;
}