import { StyleSheet, View } from "react-native";
import { ModalWrapper } from "../../common/components/modal-wrapper";
import { Progress } from "../../common/api/api-definitions";
import { ProgressComponent } from "../profile/progress-component";
import { AchievementsComponent } from "../profile/achievements-component";
import { theme } from "../../common/theme";
import { ProfileActionsComponent } from "../profile/profile-actions-component";
import { AvatarComponent } from "../profile/avatar-component";

interface LeaderModalProps {
  progress?: Progress;
  onClose: () => void;
}

export const LeaderModal = (props: LeaderModalProps) => {
  return (
    <ModalWrapper
      visible={props.progress !== undefined}
      onClose={props.onClose}
    >
      <View style={styles.modalContent}>
        <AvatarComponent
          avatarUri={props.progress?.avatarUri}
          username={props.progress?.username}
          level={props.progress?.level}
        />
        <ProgressComponent loading={false} progress={props.progress} />
        <AchievementsComponent userId={props.progress?.userId} />
        <View />
        <ProfileActionsComponent userId={props.progress?.userId} />
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.dark[300],
  },
});
