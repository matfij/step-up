import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { theme, themeComposable } from "../theme";

type AppButtonProps = {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  style?: StyleProp<ViewStyle>;
};

export const AppButton = (props: AppButtonProps) => {
  return (
    <Pressable
      disabled={props.disabled}
      onPress={props.onClick}
      style={[styles.button, props.style]}
    >
      <Text style={styles.label}>{props.label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    ...themeComposable.shadows.lg,
    width: "100%",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary[500],
    borderRadius: theme.borderRadius.md,
  },
  label: {
    ...themeComposable.typography.bodyLarge,
    fontWeight: 700,
    color: theme.colors.dark[500],
  },
});
