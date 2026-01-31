import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { theme } from "../../common/theme";

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary[500],
        tabBarInactiveTintColor: theme.colors.primary[200],
        tabBarStyle: {
          backgroundColor: theme.colors.dark[100],
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("index.title"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="compass" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: t("activity.title"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="play-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: t("leaderboard.title"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="medal-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
