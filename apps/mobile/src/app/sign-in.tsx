import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";
import { AppAction } from "../common/components/app-action";
import { AppButton } from "../common/components/app-button";
import { AppInput } from "../common/components/app-input";
import { theme, themeComposable } from "../common/theme";
import { isValidEmail } from "../common/utils";

export default function Index() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showAuthCode, setShowAuthCode] = useState(false);
  const [authCode, setAuthCode] = useState("");

  const onSignIn = () => {
    setEmailError("");

    if (!isValidEmail(email)) {
      setEmailError(t("auth.emailInvalid"));
      setShowAuthCode(false);
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
      <View style={styles.brandWrapper}>
        <Image
          style={styles.brandImage}
          source={require("@assets/images/icon.png")}
        />
        <Text style={styles.title}>{t("brand.title")}</Text>
      </View>
      <AppInput
        label={t("auth.email")}
        value={email}
        error={emailError}
        onChange={setEmail}
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
        label={t("auth.signIn")}
        onClick={onSignIn}
        style={{ width: "70%", marginTop: theme.spacing.md }}
      />
      <AppAction
        label={t("auth.newAccount")}
        onClick={() => router.push("/sign-up")}
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
});
