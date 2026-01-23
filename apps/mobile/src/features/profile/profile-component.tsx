import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { progressClient } from "../../common/api/progress-client";
import { useRequest } from "../../common/api/use-request";
import { AppWrapper } from "../../common/components/app-wrapper";
import { useUserStore } from "../../common/state/user-store";
import { theme, themeComposable } from "../../common/theme";
import { AchievementsComponent } from "./achievements-component";
import { ActivitiesModal } from "./activities-modal";
import { ProgressComponent } from "./progress-component";

export const ProfileComponent = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const getProgress = useRequest(progressClient.getByUserId);
  const [showActivities, setShowActivities] = useState(false);

  useEffect(() => {
    if (user) {
      getProgress.call(user.id);
    }
  }, []);

  if (!user || !getProgress.data) {
    return <></>;
  }

  return (
    <AppWrapper>
      <View style={styles.avatarWrapper}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatarImage}
            source={require("@assets/images/avatar.png")}
          />
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{getProgress.data.level}</Text>
          </View>
        </View>
        <Text style={styles.userLabel}>{user.username}</Text>
      </View>

      <ProgressComponent
        progress={getProgress.data}
        loading={getProgress.loading}
      />

      <AchievementsComponent userId={user.id} />

      <View style={styles.actionsWrapper}>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => setShowActivities(true)}
        >
          <Text style={styles.actionLabel}>{t("profile.viewActivities")}</Text>
          <MaterialCommunityIcons
            name="navigation-variant-outline"
            size={25}
            style={styles.actionIcon}
          />
        </TouchableOpacity>
      </View>

      <ActivitiesModal
        userId={user.id}
        visible={showActivities}
        onClose={() => setShowActivities(false)}
      />
    </AppWrapper>
  );
};

const styles = StyleSheet.create({
  avatarWrapper: {
    width: "90%",
    alignItems: "center",
    borderBottomColor: theme.colors.light[300],
    borderBottomWidth: 1,
    paddingBottom: theme.spacing.lg,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: theme.spacing.md,
  },
  avatarImage: {
    width: 128,
    height: 128,
    borderRadius: theme.borderRadius.lg,
    borderColor: theme.colors.dark[100],
    borderWidth: 3,
  },
  levelBadge: {
    ...themeComposable.shadows.secondaryMd,
    position: "absolute",
    bottom: -8,
    right: -8,
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.secondary[500],
    borderColor: theme.colors.dark[100],
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    opacity: theme.opacity.glass,
  },
  levelText: {
    ...themeComposable.typography.bodyBold,
    color: theme.colors.dark[700],
    fontSize: 18,
  },
  userLabel: {
    ...themeComposable.typography.h1,
    color: theme.colors.light[100],
  },

  actionsWrapper: {
    width: "90%",
  },
  actionItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  actionLabel: {
    fontSize: 18,
    fontWeight: 600,
    color: theme.colors.primary[100],
    textAlign: "left",
  },
  actionIcon: {
    color: theme.colors.primary[300],
  },
});
