import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { progressClient } from "../../common/api/progress-client";
import { useRequest } from "../../common/api/use-request";
import { AppWrapper } from "../../common/components/app-wrapper";
import { useUserStore } from "../../common/state/user-store";
import { AchievementsComponent } from "./achievements-component";
import { ProgressComponent } from "./progress-component";
import { ProfileActionsComponent } from "./profile-actions-component";
import { AvatarComponent } from "./avatar-component";

export const ProfileComponent = () => {
  const { user, signOut } = useUserStore();
  const getProgress = useRequest(progressClient.getByUserId);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        getProgress.call(user.id, false);
      }
    }, [user]),
  );

  return (
    <AppWrapper>
      <AvatarComponent
        avatarUri={user?.avatarUri}
        username={user?.username}
        level={getProgress.data?.level}
      />
      <ProgressComponent
        progress={getProgress.data}
        loading={getProgress.loading}
      />
      <AchievementsComponent userId={user?.id} />
      <ProfileActionsComponent userId={user?.id} />
    </AppWrapper>
  );
};
