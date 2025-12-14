import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { ApiError } from "../api/api-definitions";
import { theme, themeComposable } from "../theme";
import { useTranslation } from "react-i18next";

type AppApiErrorProps = {
  error?: ApiError;
  style?: StyleProp<TextStyle>;
};

export const AppApiError = (props: AppApiErrorProps) => {
  const { t } = useTranslation();

  return (
    <>
      {props.error && (
        <Text style={[styles.error, props.style]}>
          {t(
            props.error.key,
            props.error.field ? { field: props.error.field } : {}
          )}
        </Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  error: {
    ...themeComposable.typography.bodySmall,
    ...themeComposable.shadows.md,
    marginTop: theme.spacing.md,
    marginBottom: -theme.spacing.lg,
    fontWeight: 600,
    color: theme.colors.status.error,
  },
});
