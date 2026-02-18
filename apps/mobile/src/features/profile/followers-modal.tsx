import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { ModalWrapper } from "../../common/components/modal-wrapper";
import { theme } from "../../common/theme";
import { useRequest } from "../../common/api/use-request";
import { followerClient } from "../../common/api/follower-client";
import { AppButtonSecondary } from "../../common/components/app-button";
import { useUserStore } from "../../common/state/user-store";
import { AppApiError } from "../../common/components/app-api-error";
import { Follower } from "../../common/api/api-definitions";
import { withAlpha } from "../../common/utils";

export interface FollowersModalProps {
  userId?: string;
  mode: "none" | "followers" | "following";
  onClose: () => void;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;

export const FollowersModal = (props: FollowersModalProps) => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const follow = useRequest(followerClient.follow);
  const unFollow = useRequest(followerClient.unfollow);
  const getFollowers = useRequest(followerClient.getFollowers);
  const getFollowing = useRequest(followerClient.getFollowing);
  const getCurrentUserFollowing = useRequest(followerClient.getFollowing);

  const [existingFollower, setExistingFollower] = useState<Follower>();

  const showActions =
    !(getFollowers.loading || getFollowing.loading) &&
    !getCurrentUserFollowing.loading &&
    props.mode === "followers" &&
    user?.id !== props.userId &&
    user?.id !== undefined;

  const showEmptyMessage =
    (props.mode === "followers" &&
      getFollowers.success &&
      getFollowers.data?.length === 0) ||
    (props.mode === "following" &&
      getFollowing.success &&
      getFollowing.data?.length === 0);

  useEffect(() => {
    fetchFollowersFollowing();
  }, [props.userId, props.mode]);

  useEffect(() => {
    if (follow.success || unFollow.success) {
      fetchFollowersFollowing();
    }
  }, [follow.success, unFollow.success]);

  const fetchFollowersFollowing = () => {
    if (props.userId && props.mode === "followers") {
      getFollowers.call(props.userId);
    } else if (props.userId && props.mode === "following") {
      getFollowing.call(props.userId);
    }
    if (user?.id && showActions) {
      getCurrentUserFollowing.call(user.id);
    }
  };

  useEffect(() => {
    if (
      getCurrentUserFollowing.success &&
      props.userId !== user?.id &&
      user?.id !== undefined
    ) {
      const followerMatch = getCurrentUserFollowing.data?.find(
        (f) => f.followingId === props.userId,
      );
      setExistingFollower(followerMatch);
    }
  }, [
    getCurrentUserFollowing.success,
    getCurrentUserFollowing.data,
    props.userId,
    user?.id,
  ]);

  const onFollow = () => {
    if (props.userId) {
      follow.call(props.userId);
    }
  };

  const onUnFollow = () => {
    if (existingFollower) {
      unFollow.call(existingFollower.id);
    }
  };

  const renderFollower = (follower: Follower) => (
    <View key={follower.id + `${Math.random()}`} style={styles.followerItem}>
      <Image
        style={styles.followerImage}
        source={require("@assets/images/avatar.png")}
      />
      <Text style={styles.followerLabel}>
        {props.mode === "followers"
          ? follower.followerUsername
          : follower.followingUsername}
      </Text>
    </View>
  );

  return (
    <ModalWrapper visible={props.mode !== "none"} onClose={props.onClose}>
      <View style={styles.modalContent}>
        <ScrollView style={styles.followersWrapper}>
          {props.mode === "followers" && getFollowers.data?.map(renderFollower)}
          {props.mode === "following" && getFollowing.data?.map(renderFollower)}
        </ScrollView>
        {showEmptyMessage && (
          <Text style={styles.emptyLabel}>
            {props.mode === "followers"
              ? t("profile.emptyFollowers")
              : t("profile.emptyFollowing")}
          </Text>
        )}
        {(getFollowers.loading || getFollowing.loading) && (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size={64} color={theme.colors.primary[500]} />
          </View>
        )}
        <AppApiError
          error={
            getFollowers.error ||
            getFollowing.error ||
            follow.error ||
            unFollow.error
          }
          style={styles.errorWrapper}
        />
        {showActions && (
          <AppButtonSecondary
            label={
              existingFollower ? t("profile.unfollow") : t("profile.follow")
            }
            disabled={follow.loading || unFollow.loading}
            onClick={existingFollower ? onUnFollow : onFollow}
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
  followersWrapper: {
    maxHeight: 0.6 * SCREEN_HEIGHT,
  },
  followerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: withAlpha(theme.colors.secondary[400], 0.3),
  },
  followerImage: {
    height: 40,
    width: 40,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    backgroundColor: withAlpha(
      theme.colors.secondary[500],
      theme.opacity.ether,
    ),
  },
  followerLabel: {
    color: theme.colors.light[300],
  },
  loadingWrapper: {
    padding: theme.spacing.xl,
  },
  emptyLabel: {
    fontSize: 20,
    color: theme.colors.light[300],
    padding: theme.spacing.xl,
    textAlign: "center",
  },
  errorWrapper: {
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
});
