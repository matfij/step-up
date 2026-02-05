import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../common/theme";
import { ActivitiesModal } from "./activities-modal";

interface ProfileActionsComponentProps {
  userId?: string;
}

export const ProfileActionsComponent = (
  props: ProfileActionsComponentProps,
) => {
  const { t } = useTranslation();
  const [showActivities, setShowActivities] = useState(false);

  return (
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
      <ActivitiesModal
        userId={props.userId}
        visible={showActivities}
        onClose={() => setShowActivities(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
