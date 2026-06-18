import { StatusRecurso } from "@/lib/types";
import { Text, View } from "react-native";

type Props = { status: StatusRecurso };

const config: Record<StatusRecurso, { label: string; bg: string; text: string; border: string }> = {
  OK:      { label: "OK",      bg: "bg-cyan-500/10",   text: "text-cyan-400",   border: "border-cyan-500/40" },
  ATENCAO: { label: "ATENÇÃO", bg: "bg-yellow-400/10", text: "text-yellow-400", border: "border-yellow-400/40" },
  CRITICO: { label: "CRÍTICO", bg: "bg-red-500/10",    text: "text-red-400",    border: "border-red-500/40" },
};

const StatusBadge = ({ status }: Props) => {
  const c = config[status];
  return (
    <View className={`px-3 py-1 rounded-full border ${c.bg} ${c.border}`}>
      <Text className={`text-xs font-bold tracking-widest ${c.text}`}>{c.label}</Text>
    </View>
  );
};

export default StatusBadge;