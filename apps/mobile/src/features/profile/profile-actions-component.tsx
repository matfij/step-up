import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../common/theme";
import { ActivitiesModal } from "./activities-modal";
import { FollowersModal, FollowersModalProps } from "./followers-modal";

interface ProfileActionsComponentProps {
  userId?: string;
}

export const ProfileActionsComponent = (
  props: ProfileActionsComponentProps,
) => {
  const { t } = useTranslation();
  const [showActivities, setShowActivities] = useState(false);
  const [showFollowers, setShowFollowers] =
    useState<FollowersModalProps["mode"]>("none");

  return (
    <>
      <View style={styles.actionsWrapper}>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => setShowActivities(true)}
        >
          <MaterialCommunityIcons
            name="speedometer"
            size={20}
            style={styles.actionIcon}
          />
          <Text style={styles.actionLabel}>{t("profile.viewActivities")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => setShowFollowers("followers")}
        >
          <MaterialCommunityIcons
            name="account-arrow-left"
            size={20}
            style={styles.actionIcon}
          />
          <Text style={styles.actionLabel}>{t("profile.viewFollowers")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => setShowFollowers("following")}
        >
          <MaterialCommunityIcons
            name="account-arrow-right"
            size={20}
            style={styles.actionIcon}
          />
          <Text style={styles.actionLabel}>{t("profile.viewFollowing")}</Text>
        </TouchableOpacity>
      </View>
      <ActivitiesModal
        userId={props.userId}
        visible={showActivities}
        onClose={() => setShowActivities(false)}
      />
      <FollowersModal
        userId={props.userId}
        mode={showFollowers}
        onClose={() => setShowFollowers("none")}
      />
    </>
  );
};

const styles = StyleSheet.create({
  actionsWrapper: {
    width: "90%",
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  actionItem: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.dark[200],
    borderRadius: theme.borderRadius.sm,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.colors.primary[100],
    textAlign: "left",
  },
  actionIcon: {
    color: theme.colors.primary[300],
  },
});
