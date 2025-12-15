import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";
import { AppAction } from "../common/components/app-action";
import { AppButton } from "../common/components/app-button";
import { AppInput } from "../common/components/app-input";
import { theme, themeComposable } from "../common/theme";
import { isValidAuthToken, isValidEmail } from "../common/utils";
import { useRequest } from "../common/api/api-hooks";
import { userClient } from "../common/api/user-client";
import { useUserStore } from "../common/state/user-store";
import { AppApiError } from "../common/components/app-api-error";

export default function Index() {
  const router = useRouter();
  const { t } = useTranslation();
  const { signIn } = useUserStore();
  const startSignIn = useRequest(userClient.startSignIn);
  const completeSignIn = useRequest(userClient.completeSignIn);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [authTokenError, setAuthTokenError] = useState("");

  useEffect(() => setEmailError(""), [email]);

  useEffect(() => setAuthTokenError(""), [authToken]);

  useEffect(() => {
    if (completeSignIn.success && completeSignIn.data) {
      signIn({
        id: completeSignIn.data.id,
        email: completeSignIn.data.email,
        username: completeSignIn.data.username,
        apiToken: completeSignIn.data.apiToken,
      });
    }
  }, [completeSignIn.success]);

  const onSignIn = () => {
    if (startSignIn.success) {
      onCompleteSignIn();
    } else {
      onStartSignIn();
    }
  };

  const onStartSignIn = () => {
    if (!isValidEmail(email)) {
      setEmailError(t("auth.emailInvalid"));
      return;
    }
    startSignIn.call({ email });
  };

  const onCompleteSignIn = () => {
    if (!isValidEmail(email)) {
      setEmailError(t("auth.emailInvalid"));
      return;
    } else if (!isValidAuthToken(authToken)) {
      setAuthTokenError(t("errors.authTokenNotValid"));
      return;
    }
    completeSignIn.call({ email, authToken });
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
      {startSignIn.success && (
        <AppInput
          keyboard="number-pad"
          label={t("auth.authCodeCheckInbox")}
          value={authToken}
          error={authTokenError}
          onChange={setAuthToken}
          style={{ width: "70%" }}
        />
      )}
      <AppApiError error={startSignIn.error} />
      <AppApiError error={completeSignIn.error} />
      <AppButton
        label={t("auth.signIn")}
        disabled={startSignIn.loading || completeSignIn.loading}
        onClick={onSignIn}
        style={{ width: "70%", marginTop: theme.spacing.md }}
      />
      <AppAction
        label={t("auth.newAccount")}
        disabled={startSignIn.loading || completeSignIn.loading}
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
