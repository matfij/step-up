import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { AppAction } from "../common/components/app-action";
import { AppButton } from "../common/components/app-button";
import { AppInput } from "../common/components/app-input";
import { appConfig } from "../common/config";
import { theme, themeComposable } from "../common/theme";
import {
  isValidAuthToken,
  isValidEmail,
  isValidUsername,
} from "../common/utils";
import { useRequest } from "../common/api/api-hooks";
import { userClient } from "../common/api/user-client";
import { useUserStore } from "../common/state/user-store";
import { AppApiError } from "../common/components/app-api-error";

export default function SignUp() {
  const router = useRouter();
  const { t } = useTranslation();
  const { signIn } = useUserStore();
  const startSignUp = useRequest(userClient.startSignUp);
  const completeSignUp = useRequest(userClient.completeSignUp);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [authTokenError, setAuthTokenError] = useState("");

  useEffect(() => setEmailError(""), [email]);

  useEffect(() => setUsernameError(""), [username]);

  useEffect(() => setAuthTokenError(""), [authToken]);

  useEffect(() => {
    if (completeSignUp.success && completeSignUp.data) {
      signIn({
        id: completeSignUp.data.id,
        email: completeSignUp.data.email,
        username: completeSignUp.data.username,
      });
    }
  }, [completeSignUp.success]);

  const onSignUp = () => {
    if (startSignUp.success) {
      onCompleteSignUp();
    } else {
      onStartSignUp();
    }
  };

  const onStartSignUp = () => {
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
    startSignUp.call({ email, username });
  };

  const onCompleteSignUp = () => {
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
    } else if (!isValidAuthToken(authToken)) {
      setAuthTokenError(t("errors.authTokenNotValid"));
      return;
    }
    completeSignUp.call({ email, authToken });
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
      {startSignUp.success && (
        <AppInput
          keyboard="number-pad"
          label={t("auth.authCodeCheckInbox")}
          value={authToken}
          error={authTokenError}
          onChange={setAuthToken}
          style={{ width: "70%" }}
        />
      )}
      <AppApiError error={startSignUp.error} />
      <AppApiError error={completeSignUp.error} />
      <AppButton
        label={t("auth.signUp")}
        disabled={startSignUp.loading || completeSignUp.loading}
        onClick={onSignUp}
        style={{ width: "70%", marginTop: theme.spacing.md }}
      />
      <AppAction
        label={t("auth.existingAccount")}
        disabled={startSignUp.loading || completeSignUp.loading}
        onClick={() => router.push("/sign-in")}
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
