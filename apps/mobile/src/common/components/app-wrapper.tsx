import {
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { theme } from "../theme";
import { ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AppWrapperProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const AppWrapper = (props: AppWrapperProps) => {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.wrapper, props.style, { marginTop: insets.top }]}
    >
      {props.children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.dark[500],
  },
});
