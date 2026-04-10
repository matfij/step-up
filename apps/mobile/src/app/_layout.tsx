import "../common/i18n";
import { Stack } from "expo-router";
import { useUserStore } from "../common/state/user-store";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "../common/components/error-boundary";
import { handleBackgroundError } from "../common/utils";

export default function RootLayout() {
  const { user } = useUserStore();

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <Stack>
          <StatusBar />
          <Stack.Protected guard={!!user}>
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false, headerTitle: undefined }}
            />
          </Stack.Protected>

          <Stack.Protected guard={!user}>
            <Stack.Screen name="sign-in" options={{ headerShown: false }} />
            <Stack.Screen name="sign-up" options={{ headerShown: false }} />
          </Stack.Protected>
        </Stack>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const defaultHandler = ErrorUtils.getGlobalHandler?.();

ErrorUtils.setGlobalHandler((error, isFatal) => {
  handleBackgroundError(error, "global");

  if (defaultHandler) {
    defaultHandler(error, isFatal);
  }
});
