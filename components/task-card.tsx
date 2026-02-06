import { View, Text, Pressable } from "react-native";
import { Task } from "@/hooks/use-task-store";
import { cn } from "@/lib/utils";
import { useColors } from "@/hooks/use-colors";

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onToggle: () => void;
}

export function TaskCard({ task, onPress, onToggle }: TaskCardProps) {
  const colors = useColors();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#EF4444";
      case "medium":
        return "#F59E0B";
      case "low":
        return "#22C55E";
      default:
        return colors.primary;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "高";
      case "medium":
        return "中";
      case "low":
        return "低";
      default:
        return "";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "今天";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "明天";
    } else {
      return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View className="flex-row items-center gap-3 bg-surface rounded-lg p-4 mb-3 border border-border">
        {/* 复选框 */}
        <Pressable
          onPress={onToggle}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <View
            className={cn(
              "w-6 h-6 rounded-full border-2 items-center justify-center",
              task.completed ? "bg-primary border-primary" : "border-border"
            )}
          >
            {task.completed && (
              <Text className="text-white text-sm font-bold">✓</Text>
            )}
          </View>
        </Pressable>

        {/* 任务内容 */}
        <View className="flex-1">
          <Text
            className={cn(
              "text-base font-semibold",
              task.completed ? "text-muted line-through" : "text-foreground"
            )}
            numberOfLines={1}
          >
            {task.title}
          </Text>

          {/* 优先级和截止日期 */}
          <View className="flex-row items-center gap-2 mt-1">
            {/* 优先级指示器 */}
            <View
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getPriorityColor(task.priority) }}
            />
            <Text className="text-xs text-muted">
              {getPriorityLabel(task.priority)}优先级
            </Text>

            {/* 截止日期 */}
            {task.dueDate && (
              <>
                <Text className="text-xs text-muted">•</Text>
                <Text className="text-xs text-muted">{formatDate(task.dueDate)}</Text>
              </>
            )}
          </View>
        </View>

        {/* 优先级标签 */}
        <View
          className="px-2 py-1 rounded"
          style={{ backgroundColor: getPriorityColor(task.priority) + "20" }}
        >
          <Text
            className="text-xs font-medium"
            style={{ color: getPriorityColor(task.priority) }}
          >
            {getPriorityLabel(task.priority)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
