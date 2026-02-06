import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  dueDate: string | null;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

const TASKS_KEY = "@task_manager/tasks";
const CATEGORIES_KEY = "@task_manager/categories";

const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "工作", color: "#0a7ea4" },
  { id: "2", name: "个人", color: "#22C55E" },
  { id: "3", name: "购物", color: "#F59E0B" },
];

export function useTaskStore() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化加载数据
  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [tasksData, categoriesData] = await Promise.all([
        AsyncStorage.getItem(TASKS_KEY),
        AsyncStorage.getItem(CATEGORIES_KEY),
      ]);

      if (tasksData) {
        setTasks(JSON.parse(tasksData));
      }

      if (categoriesData) {
        setCategories(JSON.parse(categoriesData));
      } else {
        // 初始化默认分类
        setCategories(DEFAULT_CATEGORIES);
        await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 保存任务到本地存储
  const saveTasks = useCallback(async (newTasks: Task[]) => {
    try {
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(newTasks));
      setTasks(newTasks);
    } catch (error) {
      console.error("Failed to save tasks:", error);
    }
  }, []);

  // 保存分类到本地存储
  const saveCategories = useCallback(async (newCategories: Category[]) => {
    try {
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(newCategories));
      setCategories(newCategories);
    } catch (error) {
      console.error("Failed to save categories:", error);
    }
  }, []);

  // 添加任务
  const addTask = useCallback(
    async (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const newTasks = [newTask, ...tasks];
      await saveTasks(newTasks);
      return newTask;
    },
    [tasks, saveTasks]
  );

  // 更新任务
  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      const newTasks = tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : task
      );
      await saveTasks(newTasks);
    },
    [tasks, saveTasks]
  );

  // 删除任务
  const deleteTask = useCallback(
    async (id: string) => {
      const newTasks = tasks.filter((task) => task.id !== id);
      await saveTasks(newTasks);
    },
    [tasks, saveTasks]
  );

  // 切换任务完成状态
  const toggleTask = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        await updateTask(id, { completed: !task.completed });
      }
    },
    [tasks, updateTask]
  );

  // 添加分类
  const addCategory = useCallback(
    async (category: Omit<Category, "id">) => {
      const newCategory: Category = {
        ...category,
        id: Date.now().toString(),
      };
      const newCategories = [...categories, newCategory];
      await saveCategories(newCategories);
      return newCategory;
    },
    [categories, saveCategories]
  );

  // 删除分类
  const deleteCategory = useCallback(
    async (id: string) => {
      const newCategories = categories.filter((cat) => cat.id !== id);
      await saveCategories(newCategories);
    },
    [categories, saveCategories]
  );

  // 获取统计信息
  const getStats = useCallback(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;

    return { total, completed, pending };
  }, [tasks]);

  // 按分类获取任务
  const getTasksByCategory = useCallback(
    (categoryId: string) => {
      return tasks.filter((task) => task.category === categoryId);
    },
    [tasks]
  );

  return {
    tasks,
    categories,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    addCategory,
    deleteCategory,
    getStats,
    getTasksByCategory,
    loadData,
  };
}
