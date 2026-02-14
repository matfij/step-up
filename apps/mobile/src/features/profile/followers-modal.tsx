import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { ModalWrapper } from "../../common/components/modal-wrapper";
import { theme } from "../../common/theme";
import { useRequest } from "../../common/api/use-request";
import { followerClient } from "../../common/api/follower-client";
import { AppButtonSecondary } from "../../common/components/app-button";
import { useUserStore } from "../../common/state/user-store";

export interface FollowersModalProps {
  userId?: string;
  mode: "none" | "followers" | "following";
  onClose: () => void;
}

export const FollowersModal = (props: FollowersModalProps) => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const follow = useRequest(followerClient.follow);
  const unFollow = useRequest(followerClient.unfollow);

  const canFollow = true; // TODO - adjust when followers available
  const showActions =
    props.mode === "followers" &&
    user?.id !== props.userId &&
    user?.id !== undefined;

  const onFollow = async () => {
    if (props.userId) {
      follow.call(props.userId);
    }
  };

  const onUnFollow = async () => {
    if (props.userId) {
      unFollow.call(props.userId);
    }
  };

  return (
    <ModalWrapper visible={props.mode !== "none"} onClose={props.onClose}>
      <View style={styles.modalContent}>
        {showActions && (
          <AppButtonSecondary
            label={canFollow ? t("profile.follow") : t('t("profile.unfollow")')}
            disabled={follow.loading || unFollow.loading}
            onClick={canFollow ? onFollow : onUnFollow}
          />
        )}
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: theme.colors.dark[500],
  },
  actionsWrapper: {
    display: "flex",
    flexDirection: "row",
  },
});
