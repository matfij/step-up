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
      style={({ pressed }) => [
        styles.button,
        props.disabled ? styles.disabled : styles.enabled,
        pressed && !props.disabled && styles.pressed,
        props.style,
      ]}
    >
      <Text style={styles.label}>{props.label}</Text>
    </Pressable>
  );
};

export const AppButtonSecondary = (props: AppButtonProps) => {
  return (
    <Pressable
      disabled={props.disabled}
      onPress={props.onClick}
      style={({ pressed }) => [
        styles.buttonSecondary,
        props.disabled ? styles.disabledSecondary : styles.enabledSecondary,
        pressed && !props.disabled && styles.pressed,
        props.style,
      ]}
    >
      <Text style={styles.labelSecondary}>{props.label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    ...themeComposable.shadows.lg,
    width: "100%",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  enabled: {
    backgroundColor: theme.colors.primary[500],
  },
  disabled: {
    backgroundColor: theme.colors.primary[300],
    opacity: 0.7,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonSecondary: {
    ...themeComposable.shadows.md,
    backgroundColor: "transparent",
    width: "100%",
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  enabledSecondary: {
    backgroundColor: theme.colors.secondary[100],
  },
  disabledSecondary: {
    // backgroundColor: theme.colors.primary[300],
    opacity: 0.7,
    shadowOpacity: 0,
    elevation: 0,
  },
  labelSecondary: {
    ...themeComposable.typography.bodyBold,
    fontWeight: 600,
    color: theme.colors.secondary[700],
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    ...themeComposable.typography.bodyLarge,
    fontWeight: 700,
    color: theme.colors.dark[500],
  },
});
