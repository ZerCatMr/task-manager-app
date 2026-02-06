import { View, Text } from "react-native";

interface StatsCardProps {
  total: number;
  completed: number;
  pending: number;
}

export function StatsCard({ total, completed, pending }: StatsCardProps) {
  return (
    <View className="flex-row gap-3 mb-6">
      {/* 总任务数 */}
      <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
        <Text className="text-sm text-muted mb-1">总任务</Text>
        <Text className="text-2xl font-bold text-foreground">{total}</Text>
      </View>

      {/* 已完成 */}
      <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
        <Text className="text-sm text-muted mb-1">已完成</Text>
        <Text className="text-2xl font-bold text-primary">{completed}</Text>
      </View>

      {/* 待完成 */}
      <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
        <Text className="text-sm text-muted mb-1">待完成</Text>
        <Text className="text-2xl font-bold text-warning">{pending}</Text>
      </View>
    </View>
  );
}
