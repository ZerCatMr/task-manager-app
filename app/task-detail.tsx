import {
  ScrollView,
  View,
  Text,
  Pressable,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { useTaskStore, Task } from "@/hooks/use-task-store";
import { useColors } from "@/hooks/use-colors";

export default function TaskDetailScreen() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const { tasks, deleteTask, toggleTask, categories } = useTaskStore();
  const colors = useColors();

  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    if (taskId) {
      const foundTask = tasks.find((t) => t.id === taskId);
      setTask(foundTask || null);
    }
  }, [taskId, tasks]);

  if (!task) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground">任务不存在</Text>
      </ScreenContainer>
    );
  }

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

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "未分类";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "未设置";
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDelete = () => {
    Alert.alert("删除任务", "确定要删除这个任务吗？", [
      {
        text: "取消",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "删除",
        onPress: async () => {
          await deleteTask(task.id);
          router.back();
        },
        style: "destructive",
      },
    ]);
  };

  const handleToggle = async () => {
    await toggleTask(task.id);
    const updatedTask = tasks.find((t) => t.id === task.id);
    if (updatedTask) {
      setTask(updatedTask);
    }
  };

  const handleEdit = () => {
    router.push({
      pathname: "/edit-task" as any,
      params: { taskId: task.id },
    });
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 标题 */}
        <View className="flex-row items-start justify-between mb-6">
          <Text
            className={`flex-1 text-3xl font-bold ${
              task.completed ? "text-muted line-through" : "text-foreground"
            }`}
          >
            {task.title}
          </Text>
        </View>

        {/* 完成状态切换 */}
        <Pressable
          onPress={handleToggle}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <View
            className={`flex-row items-center gap-3 p-4 rounded-lg mb-6 border ${
              task.completed
                ? "bg-primary/10 border-primary"
                : "bg-surface border-border"
            }`}
          >
            <View
              className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                task.completed
                  ? "bg-primary border-primary"
                  : "border-border"
              }`}
            >
              {task.completed && (
                <Text className="text-white text-sm font-bold">✓</Text>
              )}
            </View>
            <Text
              className={`flex-1 font-semibold ${
                task.completed ? "text-primary" : "text-foreground"
              }`}
            >
              {task.completed ? "已完成" : "点击标记为完成"}
            </Text>
          </View>
        </Pressable>

        {/* 任务信息卡片 */}
        <View className="bg-surface rounded-lg border border-border p-4 mb-6">
          {/* 优先级 */}
          <View className="flex-row items-center justify-between py-3 border-b border-border">
            <Text className="text-foreground">优先级</Text>
            <View
              className="px-3 py-1 rounded"
              style={{ backgroundColor: getPriorityColor(task.priority) + "20" }}
            >
              <Text
                className="font-medium text-sm"
                style={{ color: getPriorityColor(task.priority) }}
              >
                {getPriorityLabel(task.priority)}优先级
              </Text>
            </View>
          </View>

          {/* 截止日期 */}
          <View className="flex-row items-center justify-between py-3 border-b border-border">
            <Text className="text-foreground">截止日期</Text>
            <Text className="text-muted">{formatDate(task.dueDate)}</Text>
          </View>

          {/* 分类 */}
          <View className="flex-row items-center justify-between py-3 border-b border-border">
            <Text className="text-foreground">分类</Text>
            <Text className="text-muted">{getCategoryName(task.category)}</Text>
          </View>

          {/* 创建时间 */}
          <View className="flex-row items-center justify-between py-3">
            <Text className="text-foreground">创建时间</Text>
            <Text className="text-muted text-sm">
              {new Date(task.createdAt).toLocaleDateString("zh-CN")}
            </Text>
          </View>
        </View>

        {/* 任务描述 */}
        {task.description && (
          <View className="mb-6">
            <Text className="text-sm text-muted mb-2">任务描述</Text>
            <View className="bg-surface rounded-lg border border-border p-4">
              <Text className="text-foreground leading-relaxed">
                {task.description}
              </Text>
            </View>
          </View>
        )}

        {/* 操作按钮 */}
        <View className="flex-row gap-3 mt-8">
          <Pressable
            onPress={handleDelete}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            className="flex-1"
          >
            <View className="bg-error/10 border border-error rounded-lg py-4">
              <Text className="text-center text-error font-semibold">
                删除
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handleEdit}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
                transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
              },
            ]}
            className="flex-1"
          >
            <View className="bg-primary rounded-lg py-4">
              <Text className="text-center text-white font-semibold">
                编辑
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
