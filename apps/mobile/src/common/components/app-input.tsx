import {
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
  style?: StyleProp<ViewStyle>;
};

export const AppInput = (props: AppInputProps) => {
  return (
    <View style={[styles.wrapper, props.style]}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        style={styles.input}
        cursorColor={theme.colors.primary[700]}
        selectionColor={theme.colors.primary[700]}
        placeholderTextColor={theme.colors.dark[300]}
      />
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
    fontSize: 18,
    padding: theme.spacing.xs,
    paddingVertical: 2,
    color: theme.colors.primary[500],
  },
});
