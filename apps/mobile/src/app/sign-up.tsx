import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { AppAction } from "../common/components/app-action";
import { AppButton } from "../common/components/app-button";
import { AppInput } from "../common/components/app-input";
import { theme, themeComposable } from "../common/theme";

export default function SignUp() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [showAuthCode, setShowAuthCode] = useState(false);
  const [authCode, setAuthCode] = useState("");

  const onSignUp = () => {
    if (!showAuthCode) {
      setShowAuthCode(true);
      return;
    }
  };

  return (
    <View style={styles.mainWrapper}>
      <Text style={styles.title}>{t("auth.signUpTitle")}</Text>
      <AppInput label={t("auth.email")} style={{ width: "70%" }} />
      <AppInput label={t("auth.username")} style={{ width: "70%" }} />
      {showAuthCode && (
        <AppInput
          label={t("auth.authCodeCheckInbox")}
          style={{ width: "70%" }}
        />
      )}
      <AppButton
        label={t("auth.signUp")}
        onClick={onSignUp}
        style={{ width: "70%", marginTop: theme.spacing.md }}
      />
      <AppAction
        label={t("auth.existingAccount")}
        onClick={() => router.push("/")}
        style={{ marginTop: theme.spacing.lg }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.dark[500],
  },
  title: {
    ...themeComposable.typography.h1,
    ...themeComposable.textShadows.lg,
    width: "70%",
    textAlign: "center",
    color: theme.colors.primary[600],
  },
  brandImage: {
    height: 200,
    width: 200,
  },
});
