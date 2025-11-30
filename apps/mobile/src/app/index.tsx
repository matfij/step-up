import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { theme, themeComposable } from "../common/theme";

export default function Index() {
  const { t } = useTranslation();

  const onSignIn = () => {};

  const onSignUp = () => {};

  return (
    <View style={styles.mainWrapper}>
      <Text style={styles.title}>{t("brand.title")}</Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>{t("auth.email")}</Text>
        <TextInput
          style={styles.textInput}
          cursorColor={theme.colors.primary[700]}
          selectionColor={theme.colors.primary[700]}
          placeholderTextColor={theme.colors.dark[300]}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>{t("auth.authCode")}</Text>
        <TextInput
          style={styles.textInput}
          cursorColor={theme.colors.primary[700]}
          selectionColor={theme.colors.primary[700]}
          placeholderTextColor={theme.colors.dark[300]}
        />
      </View>

      <Pressable style={styles.button} onPress={onSignIn}>
        <Text style={styles.buttonText}>{t("auth.signIn")}</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={onSignUp}>
        <Text style={styles.buttonText}>{t("auth.signUp")}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.dark[500],
  },
  title: {
    ...themeComposable.typography.h1,
    color: theme.colors.primary[600],
  },
  inputWrapper: {
    width: "60%",
  },
  inputLabel: {
    ...themeComposable.typography.bodySmall,
    color: theme.colors.light[200],
  },
  textInput: {
    ...themeComposable.shadows.glow,
    fontSize: 24,
    padding: theme.spacing.xs,
    color: theme.colors.primary[500],
    paddingVertical: 0,
    borderWidth: 2,
    borderRadius: theme.borderRadius.md,
    borderColor: theme.colors.primary[600],
    backgroundColor: theme.colors.dark[300],
  },
  button: {
    ...themeComposable.shadows.lg,
    width: "60%",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary[500],
    borderRadius: theme.borderRadius.md,
  },
  buttonText: {
    ...themeComposable.typography.bodyLarge,
    fontWeight: 700,
    color: theme.colors.dark[500],
  },
});
