import { StatusRecurso } from "@/lib/types";
import { Text, View } from "react-native";

type Props = { quantidade: number; capacidadeMaxima: number; status: StatusRecurso };

const corBarra: Record<StatusRecurso, string> = {
  OK:      "bg-cyan-400",
  ATENCAO: "bg-yellow-400",
  CRITICO: "bg-red-500",
};

const corTexto: Record<StatusRecurso, string> = {
  OK:      "text-cyan-400",
  ATENCAO: "text-yellow-400",
  CRITICO: "text-red-400",
};

const BarraCapacidade = ({ quantidade, capacidadeMaxima, status }: Props) => {
  const pct = Math.min((quantidade / capacidadeMaxima) * 100, 100);

  return (
    <View className="gap-1">
      <View className="flex-row justify-between">
        <Text className="text-xs text-slate-400 font-mono">
          {quantidade.toFixed(0)} / {capacidadeMaxima.toFixed(0)}
        </Text>
        <Text className={`text-xs font-mono font-bold ${corTexto[status]}`}>
          {pct.toFixed(0)}%
        </Text>
      </View>
      <View className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <View
          className={`h-full rounded-full ${corBarra[status]}`}
          style={{ width: `${pct}%` }}
        />
      </View>
    </View>
  );
};

export default BarraCapacidade;