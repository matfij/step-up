import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { theme, themeComposable } from "../theme";

type AppActionProps = {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  style?: StyleProp<TextStyle>;
};

export const AppAction = (props: AppActionProps) => {
  const onPress = () => {
    if (!props.disabled) {
      props.onClick();
    }
  };

  return (
    <Text style={[styles.label, props.style]} onPress={onPress}>
      {props.label}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    ...themeComposable.typography.bodyBold,
    ...themeComposable.textShadows.primaryMd,
    color: theme.colors.primary[200],
    borderBottomColor: theme.colors.primary[200],
    borderBottomWidth: 2,
  },
});
