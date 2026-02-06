import { Pressable, Text, View } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface FABProps {
  onPress: () => void;
}

export function FAB({ onPress }: FABProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.8 : 1,
          transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }],
        },
      ]}
    >
      <View
        className="w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{
          backgroundColor: colors.primary,
        }}
      >
        <Text className="text-white text-3xl font-light">+</Text>
      </View>
    </Pressable>
  );
}
