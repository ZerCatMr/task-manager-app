import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

import { ScreenContainer } from "@/components/screen-container";
import { useTaskStore } from "@/hooks/use-task-store";
import { useColors } from "@/hooks/use-colors";

export default function CreateTaskScreen() {
  const router = useRouter();
  const { addTask, categories } = useTaskStore();
  const colors = useColors();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || "");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDueDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("请输入任务标题");
      return;
    }

    await addTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate ? dueDate.toISOString() : null,
      category: selectedCategory,
      completed: false,
    });

    router.back();
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
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

  const getPriorityLabel = (p: string) => {
    switch (p) {
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

  const selectedCategoryName =
    categories.find((c) => c.id === selectedCategory)?.name || "选择分类";

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 标题 */}
        <Text className="text-3xl font-bold text-foreground mb-6">
          创建新任务
        </Text>

        {/* 任务标题输入框 */}
        <View className="mb-6">
          <Text className="text-sm text-muted mb-2">任务标题 *</Text>
          <TextInput
            placeholder="输入任务标题"
            placeholderTextColor={colors.muted}
            value={title}
            onChangeText={setTitle}
            className="bg-surface border border-border rounded-lg p-4 text-foreground"
            style={{
              color: colors.foreground,
            }}
          />
        </View>

        {/* 任务描述输入框 */}
        <View className="mb-6">
          <Text className="text-sm text-muted mb-2">任务描述</Text>
          <TextInput
            placeholder="输入任务描述（可选）"
            placeholderTextColor={colors.muted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            className="bg-surface border border-border rounded-lg p-4 text-foreground"
            style={{
              color: colors.foreground,
              textAlignVertical: "top",
            }}
          />
        </View>

        {/* 优先级选择 */}
        <View className="mb-6">
          <Text className="text-sm text-muted mb-2">优先级</Text>
          <View className="flex-row gap-3">
            {(["high", "medium", "low"] as const).map((p) => (
              <Pressable
                key={p}
                onPress={() => setPriority(p)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <View
                  className={`flex-1 py-3 rounded-lg border ${
                    priority === p ? "border-primary" : "border-border"
                  }`}
                  style={{
                    backgroundColor:
                      priority === p ? getPriorityColor(p) + "20" : "transparent",
                  }}
                >
                  <Text
                    className="text-center font-medium text-foreground"
                    style={{
                      color: priority === p ? getPriorityColor(p) : colors.foreground,
                    }}
                  >
                    {getPriorityLabel(p)}优先级
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 截止日期选择 */}
        <View className="mb-6">
          <Text className="text-sm text-muted mb-2">截止日期</Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View className="bg-surface border border-border rounded-lg p-4">
              <Text className="text-foreground">
                {dueDate
                  ? dueDate.toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "点击选择日期"}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* 分类选择 */}
        <View className="mb-6">
          <Text className="text-sm text-muted mb-2">分类</Text>
          <Pressable
            onPress={() => setShowCategoryPicker(true)}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View className="bg-surface border border-border rounded-lg p-4 flex-row items-center justify-between">
              <Text className="text-foreground">{selectedCategoryName}</Text>
              <Text className="text-muted">›</Text>
            </View>
          </Pressable>
        </View>

        {/* 按钮 */}
        <View className="flex-row gap-3 mt-8">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            className="flex-1"
          >
            <View className="bg-surface border border-border rounded-lg py-4">
              <Text className="text-center text-foreground font-semibold">
                取消
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handleSave}
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
                保存任务
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>

      {/* 日期选择器 */}
      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
        />
      )}

      {/* 分类选择器 Modal */}
      <Modal
        visible={showCategoryPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-2xl">
            <View className="p-6 border-b border-border flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-foreground">
                选择分类
              </Text>
              <Pressable onPress={() => setShowCategoryPicker(false)}>
                <Text className="text-primary text-lg">完成</Text>
              </Pressable>
            </View>

            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setSelectedCategory(item.id);
                    setShowCategoryPicker(false);
                  }}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <View className="p-4 border-b border-border flex-row items-center gap-3">
                    <View
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <Text className="text-foreground flex-1">{item.name}</Text>
                    {selectedCategory === item.id && (
                      <Text className="text-primary">✓</Text>
                    )}
                  </View>
                </Pressable>
              )}
              scrollEnabled={false}
            />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
