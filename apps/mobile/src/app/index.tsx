import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { theme, themeComposable } from "../common/theme";

export default function Index() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [showAuthCode, setShowAuthCode] = useState(false);
  const [authCode, setAuthCode] = useState("");

  const onSignIn = () => {
    if (!showAuthCode) {
      setShowAuthCode(true);
      return;
    }
  };

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.brandWrapper}>
        <Image
          style={styles.brandImage}
          source={require("@assets/images/icon.png")}
        />
        <Text style={styles.title}>{t("brand.title")}</Text>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>{t("auth.email")}</Text>
        <TextInput
          style={styles.textInput}
          cursorColor={theme.colors.primary[700]}
          selectionColor={theme.colors.primary[700]}
          placeholderTextColor={theme.colors.dark[300]}
        />
      </View>

      {showAuthCode && (
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>
            {t("auth.authCode")} ({t("auth.checkInbox")})
          </Text>
          <TextInput
            style={styles.textInput}
            cursorColor={theme.colors.primary[700]}
            selectionColor={theme.colors.primary[700]}
            placeholderTextColor={theme.colors.dark[300]}
          />
        </View>
      )}

      <Pressable style={styles.button} onPress={onSignIn}>
        <Text style={styles.buttonLabel}>{t("auth.signIn")}</Text>
      </Pressable>

      <Text style={styles.newAccountLabel}>{t("auth.newAccount")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.dark[500],
  },
  brandWrapper: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...themeComposable.typography.h1,
    ...themeComposable.textShadows.md,
    width: "80%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    color: theme.colors.primary[600],
  },
  brandImage: {
    height: 200,
    width: 200,
  },
  inputWrapper: {
    width: "60%",
  },
  inputLabel: {
    ...themeComposable.typography.bodySmall,
    fontWeight: 600,
    color: theme.colors.primary[100],
  },
  textInput: {
    ...themeComposable.shadows.primaryMd,
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
    marginTop: theme.spacing.lg,
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary[500],
    borderRadius: theme.borderRadius.md,
  },
  buttonLabel: {
    ...themeComposable.typography.bodyLarge,
    fontWeight: 700,
    color: theme.colors.dark[500],
  },
  newAccountLabel: {
    ...themeComposable.typography.bodyBold,
    ...themeComposable.textShadows.primaryMd,
    marginTop: theme.spacing.lg,
    color: theme.colors.primary[200],
    borderBottomColor: theme.colors.primary[200],
    borderBottomWidth: 2,
  },
});
