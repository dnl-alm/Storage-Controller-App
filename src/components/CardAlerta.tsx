import { Alerta } from "@/lib/types";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type Props = { alerta: Alerta; onResolver?: () => void };

const CardAlerta = ({ alerta, onResolver }: Props) => (
  <View className="bg-slate-900 border border-red-500/30 rounded-xl p-4 gap-3">
    <View className="flex-row items-start gap-3">
      <View className="w-8 h-8 rounded-lg bg-red-500/10 items-center justify-center">
        <MaterialIcons name="warning" size={16} color="#ef4444" />
      </View>
      <View className="flex-1 gap-1">
        <Text className="text-red-400 font-bold text-sm tracking-wide">{alerta.recursoNome}</Text>
        <Text className="text-slate-500 text-xs font-mono">{alerta.setorNome}</Text>
        <Text className="text-slate-300 text-xs">{alerta.mensagem}</Text>
      </View>
    </View>
    {onResolver && (
      <TouchableOpacity
        onPress={onResolver}
        className="bg-red-500/10 border border-red-500/30 rounded-lg py-2 items-center"
      >
        <Text className="text-red-400 text-xs font-bold uppercase tracking-widest">
          Resolver
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

export default CardAlerta;