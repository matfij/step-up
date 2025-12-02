import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { AppAction } from "../common/components/app-action";
import { AppButton } from "../common/components/app-button";
import { AppInput } from "../common/components/app-input";
import { appConfig } from "../common/config";
import { theme, themeComposable } from "../common/theme";
import { isValidEmail, isValidUsername } from "../common/utils";

export default function SignUp() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [showAuthCode, setShowAuthCode] = useState(false);
  const [authCode, setAuthCode] = useState("");

  const onSignUp = () => {
    setEmailError("");
    setUsernameError("");

    if (!isValidEmail(email)) {
      setEmailError(t("auth.emailInvalid"));
      return;
    } else if (!isValidUsername(username)) {
      setUsernameError(
        t("auth.usernameInvalid", {
          min: appConfig.validation.usernameLengthMin,
          max: appConfig.validation.usernameLengthMax,
        })
      );
      return;
    }

    // TODO - call API

    if (!showAuthCode) {
      setShowAuthCode(true);
      return;
    }
  };

  return (
    <View style={styles.mainWrapper}>
      <Text style={styles.title}>{t("auth.signUpTitle")}</Text>
      <AppInput
        label={t("auth.email")}
        value={email}
        error={emailError}
        onChange={setEmail}
        style={{ width: "70%" }}
      />
      <AppInput
        label={t("auth.username")}
        value={username}
        error={usernameError}
        onChange={setUsername}
        style={{ width: "70%" }}
      />
      {showAuthCode && (
        <AppInput
          keyboard="number-pad"
          label={t("auth.authCodeCheckInbox")}
          value={authCode}
          onChange={setAuthCode}
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
