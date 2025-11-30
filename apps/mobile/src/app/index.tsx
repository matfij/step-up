import { useTranslation } from "react-i18next";
import { Button, Text, View } from "react-native";

export default function Index() {
  const { t } = useTranslation();

  const onSignIn = () => {};

  const onSignUp = () => {};

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Step Up</Text>

      <Button title={t("auth.signIn")} onPress={onSignIn} />
      <Button title={t("auth.signUp")} onPress={onSignUp} />
    </View>
  );
}
