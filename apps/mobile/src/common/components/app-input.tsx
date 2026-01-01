import {
  KeyboardTypeOptions,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { theme, themeComposable } from "../theme";

type AppInputProps = {
  label: string;
  value: string;
  placeholder?: string;
  error?: string;
  onChange: (newValue: string) => void;
  keyboard?: KeyboardTypeOptions;
  style?: StyleProp<ViewStyle>;
};

export const AppInput = (props: AppInputProps) => {
  return (
    <View style={[styles.wrapper, props.style]}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        value={props.value}
        placeholder={props.placeholder}
        onChangeText={props.onChange}
        style={styles.input}
        keyboardType={props.keyboard ?? "default"}
        cursorColor={theme.colors.primary[700]}
        selectionColor={theme.colors.primary[700]}
        placeholderTextColor={theme.colors.dark[300]}
      />
      {props.error && <Text style={styles.error}>{props.error}</Text>}
    </View>
  );
};

export const AppInputLight = (props: AppInputProps) => {
  return (
    <View style={[styles.wrapper, props.style]}>
      <Text style={{ ...styles.label, color: theme.colors.dark[500] }}>
        {props.label}
      </Text>
      <TextInput
        value={props.value}
        placeholder={props.placeholder}
        onChangeText={props.onChange}
        style={styles.inputLight}
        keyboardType={props.keyboard ?? "default"}
        cursorColor={theme.colors.dark[700]}
        selectionColor={theme.colors.dark[700]}
        placeholderTextColor={theme.colors.dark[300]}
      />
      {props.error && <Text style={styles.error}>{props.error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  label: {
    ...themeComposable.typography.bodySmall,
    fontWeight: 600,
    color: theme.colors.primary[100],
  },
  input: {
    ...themeComposable.shadows.primaryMd,
    ...themeComposable.borders.primaryMd,
    marginTop: theme.spacing.xs,
    fontSize: 18,
    padding: theme.spacing.xs,
    paddingVertical: 2,
    color: theme.colors.primary[500],
  },
  inputLight: {
    ...themeComposable.shadows.primaryMd,
    ...themeComposable.borders.primaryMd,
    backgroundColor: theme.colors.light[100],
    marginTop: theme.spacing.xs,
    fontSize: 18,
    padding: theme.spacing.xs,
    paddingVertical: 2,
    color: theme.colors.dark[500],
  },
  error: {
    ...themeComposable.typography.bodySmall,
    ...themeComposable.shadows.md,
    marginTop: theme.spacing.xs,
    fontWeight: 600,
    color: theme.colors.status.error,
  },
});
