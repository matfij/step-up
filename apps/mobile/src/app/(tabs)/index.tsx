import { Text } from "react-native";
import { AppWrapper } from "../../common/components/app-wrapper";
import { AppButton } from "../../common/components/app-button";
import { useUserStore } from "../../common/state/user-store";

export default function Index() {
  const { signOut } = useUserStore();

  return (
    <AppWrapper>
      <Text>Index</Text>
      <AppButton label="Sign out" onClick={signOut} style={{ width: "90%" }} />
    </AppWrapper>
  );
}
