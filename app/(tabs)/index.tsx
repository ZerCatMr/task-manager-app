import { ScrollView, View, FlatList, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { ScreenContainer } from "@/components/screen-container";
import { TaskCard } from "@/components/task-card";
import { StatsCard } from "@/components/stats-card";
import { FAB } from "@/components/fab";
import { useTaskStore } from "@/hooks/use-task-store";

export default function HomeScreen() {
  const router = useRouter();
  const {
    tasks,
    categories,
    isLoading,
    toggleTask,
    getStats,
    getTasksByCategory,
  } = useTaskStore();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 每次屏幕获得焦点时重新加载数据
  useFocusEffect(
    useCallback(() => {
      // 数据已通过 useTaskStore 自动加载
    }, [])
  );

  const stats = getStats();

  // 获取要显示的任务
  const displayTasks = selectedCategory
    ? getTasksByCategory(selectedCategory)
    : tasks;

  // 按创建时间排序（最新的在前）
  const sortedTasks = [...displayTasks].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleCreateTask = () => {
    router.push("/create-task" as any);
  };

  const handleTaskPress = (taskId: string) => {
    router.push({
      pathname: "/task-detail" as any,
      params: { taskId },
    });
  };

  const handleToggleTask = async (taskId: string) => {
    await toggleTask(taskId);
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground">加载中...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <View className="flex-1">
        {/* 顶部内容 */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="p-6">
            {/* 标题 */}
            <Text className="text-3xl font-bold text-foreground mb-6">
              我的任务
            </Text>

            {/* 统计卡片 */}
            <StatsCard
              total={stats.total}
              completed={stats.completed}
              pending={stats.pending}
            />

            {/* 分类过滤器 */}
            <View className="mb-6">
              <Text className="text-sm text-muted mb-2">分类</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {/* 全部 */}
                <Pressable
                  onPress={() => setSelectedCategory(null)}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <View
                    className={`px-4 py-2 rounded-full border ${
                      selectedCategory === null
                        ? "bg-primary border-primary"
                        : "border-border"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedCategory === null
                          ? "text-white"
                          : "text-foreground"
                      }`}
                    >
                      全部
                    </Text>
                  </View>
                </Pressable>

                {/* 分类列表 */}
                {categories.map((category) => (
                  <Pressable
                    key={category.id}
                    onPress={() => setSelectedCategory(category.id)}
                    style={({ pressed }) => [
                      {
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <View
                      className={`px-4 py-2 rounded-full border ${
                        selectedCategory === category.id
                          ? "border-primary"
                          : "border-border"
                      }`}
                      style={{
                        backgroundColor:
                          selectedCategory === category.id
                            ? category.color + "20"
                            : "transparent",
                      }}
                    >
                      <Text
                        className="text-sm font-medium text-foreground"
                        style={{
                          color:
                            selectedCategory === category.id
                              ? category.color
                              : undefined,
                        }}
                      >
                        {category.name}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* 任务列表 */}
            {sortedTasks.length === 0 ? (
              <View className="items-center justify-center py-12">
                <Text className="text-muted text-base">
                  {selectedCategory ? "该分类下暂无任务" : "暂无任务，点击 + 创建新任务"}
                </Text>
              </View>
            ) : (
              <View>
                {sortedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onPress={() => handleTaskPress(task.id)}
                    onToggle={() => handleToggleTask(task.id)}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* 浮动操作按钮 */}
        <View className="absolute bottom-6 right-6">
          <FAB onPress={handleCreateTask} />
        </View>
      </View>
    </ScreenContainer>
  );
}


