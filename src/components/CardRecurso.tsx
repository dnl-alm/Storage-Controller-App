import { Recurso } from "@/lib/types";
import { Text, TouchableOpacity, View } from "react-native";
import BarraCapacidade from "./BarraCapacidade";
import StatusBadge from "./StatusBadge";

type Props = { recurso: Recurso; onPress?: () => void };

const borderColor: Record<string, string> = {
  OK:      "border-cyan-500/20",
  ATENCAO: "border-yellow-400/20",
  CRITICO: "border-red-500/30",
};

const CardRecurso = ({ recurso, onPress }: Props) => (
  <TouchableOpacity
    onPress={onPress}
    className={`bg-slate-900 rounded-xl p-4 gap-3 border ${borderColor[recurso.status]}`}
  >
    <View className="flex-row justify-between items-start">
      <View className="flex-1 gap-1">
        <Text className="text-white font-bold text-sm tracking-wide">{recurso.nome}</Text>
        <Text className="text-slate-500 text-xs font-mono">{recurso.setorNome} · {recurso.categoria}</Text>
      </View>
      <StatusBadge status={recurso.status} />
    </View>
    <BarraCapacidade
      quantidade={recurso.quantidade}
      capacidadeMaxima={recurso.capacidadeMaxima}
      status={recurso.status}
    />
  </TouchableOpacity>
);

export default CardRecurso;