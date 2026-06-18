import { useController } from "react-hook-form";
import { Text, TextInput, TextInputProps, View } from "react-native";

type Props = { name: string; control: any; label?: string } & TextInputProps;

const MyTextInput = ({ name, control, label, ...props }: Props) => {
  const {
    field: { onChange, onBlur, value },
    fieldState: { error },
  } = useController({ name, control });

  return (
    <View className="gap-1">
      {label && (
        <Text className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 font-mono">
          {label}
        </Text>
      )}
      <TextInput
        {...props}
        onChangeText={onChange}
        onBlur={onBlur}
        value={value?.toString() ?? ""}
        placeholderTextColor="#475569"
        className={`w-full h-14 px-5 bg-slate-900 border rounded-xl text-white font-mono ${
          error ? "border-red-500" : "border-slate-700"
        } ${props.className ?? ""}`}
      />
      {error && (
        <Text className="text-red-400 text-xs ml-1 font-mono">{error.message}</Text>
      )}
    </View>
  );
};

export default MyTextInput;