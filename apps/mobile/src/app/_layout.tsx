import { Stack } from "expo-router";
import "../common/i18n";
import { useUserStore } from "../common/state/user-store";
import { StatusBar } from "react-native";

export default function RootLayout() {
  const { user } = useUserStore();

  return (
    <Stack>
      <StatusBar />
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!user}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
