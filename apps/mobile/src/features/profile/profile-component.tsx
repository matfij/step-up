import { useEffect } from "react";
import { Text } from "react-native";
import { AppWrapper } from "../../common/components/app-wrapper";
import { AppButton } from "../../common/components/app-button";
import { useUserStore } from "../../common/state/user-store";
import { progressClient } from "../../common/api/progress-client";
import { useRequest } from "../../common/api/api-hooks";

export const ProfileComponent = () => {
  const { progress, setProgress, signOut } = useUserStore();
  const getProgress = useRequest(progressClient.getByUser);

  useEffect(() => {
    if (!progress) {
      getProgress.call(undefined);
    }
  }, []);

  useEffect(() => {
    if (getProgress.success && getProgress.data) {
      setProgress(getProgress.data);
    }
  }, [getProgress.success, getProgress.data]);

  return (
    <AppWrapper>
      <Text>Index</Text>
      <AppButton label="Sign out" onClick={signOut} style={{ width: "90%" }} />
    </AppWrapper>
  );
};
