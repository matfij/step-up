import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  AchievementProgress,
  AchievementTier,
  AchievementType,
  UnitCategory,
} from "../../common/api/api-definitions";
import { ModalWrapper } from "../../common/components/modal-wrapper";
import {
  formatDate,
  formatDistance,
  formatDuration,
  formatSpeed,
} from "../../common/formatters";
import { getAchievementTierName } from "./achievements-utils";
import { theme, themeComposable } from "../../common/theme";
import { useTranslation } from "react-i18next";

export interface AchievementModalProps {
  achievement?: Achievement;
  visible: boolean;
  onClose: () => void;
}

export interface Achievement extends AchievementProgress {
  label: string;
  description: string;
  image: ImageSourcePropType;
  color: string;
  unitCategory: UnitCategory;
}

export const AchievementModal = (props: AchievementModalProps) => {
  const { t } = useTranslation();

  const getCurrentProgressLabel = (achievement: Achievement) => {
    const current = achievement.progress;
    let currentFormatted = "";

    switch (achievement.unitCategory) {
      case UnitCategory.Count:
        currentFormatted = current.toString();
        break;
      case UnitCategory.Time:
        currentFormatted = formatDuration(current, t);
        break;
      case UnitCategory.Distance:
        currentFormatted = formatDistance(current, t);
        break;
      case UnitCategory.Speed:
        currentFormatted = formatSpeed(current, t);
        break;
    }

    return achievement.type === AchievementType.Cumulative
      ? t("profile.total", { total: currentFormatted })
      : t("profile.currentBest", { best: currentFormatted });
  };

  const getRemainingProgressLabel = (achievement: Achievement) => {
    const remaining =
      achievement.type === AchievementType.Cumulative
        ? Math.max(0, achievement.nextTierProgress - achievement.progress)
        : achievement.nextTierProgress;
    let remainingFormatted = "";

    switch (achievement.unitCategory) {
      case UnitCategory.Count:
        remainingFormatted = remaining.toString();
        break;
      case UnitCategory.Time:
        remainingFormatted = formatDuration(remaining, t);
        break;
      case UnitCategory.Distance:
        remainingFormatted = formatDistance(remaining, t);
        break;
      case UnitCategory.Speed:
        remainingFormatted = formatSpeed(remaining, t);
        break;
    }

    return achievement.type === AchievementType.Cumulative
      ? t("profile.remaining", { remaining: remainingFormatted })
      : t("profile.required", { required: remainingFormatted });
  };

  const getProgressPercentage = (achievement: Achievement) => {
    if (!achievement.nextTierProgress || achievement.nextTierProgress === 0) {
      return 100;
    }
    return achievement.type === AchievementType.Cumulative
      ? Math.max(
          0,
          Math.min(
            100,
            (100 * (achievement.progress - achievement.currentTierProgress)) /
              Math.max(
                1,
                achievement.nextTierProgress - achievement.currentTierProgress,
              ),
          ),
        )
      : Math.min(
          100,
          (100 * achievement.progress) / achievement.nextTierProgress,
        );
  };

  if (!props.achievement) {
    return <></>;
  }

  return (
    <ModalWrapper
      visible={props.visible}
      style={{ width: "95%" }}
      onClose={props.onClose}
    >
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Image style={styles.modalImage} source={props.achievement.image} />
          <View>
            <Text style={styles.modalTitle}>{props.achievement.label}</Text>
            <View style={styles.modalSubtitle}>
              <Text
                style={{ ...styles.modalTier, color: props.achievement.color }}
              >
                {t(getAchievementTierName(props.achievement.tier))}
              </Text>
              <Text style={styles.modalDate}>
                {formatDate(props.achievement.achievedAt)}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.modalDescription}>
          {props.achievement.description}
        </Text>

        {props.achievement.tier !== AchievementTier.Achieved && (
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>
                {getCurrentProgressLabel(props.achievement)}
              </Text>
              {props.achievement.tier !== AchievementTier.MasterIII && (
                <Text style={styles.progressLabel}>
                  {getRemainingProgressLabel(props.achievement)}
                </Text>
              )}
            </View>

            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${getProgressPercentage(props.achievement)}%`,
                    backgroundColor: props.achievement.color,
                  },
                ]}
              />
            </View>
          </View>
        )}
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: theme.colors.dark[300],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.dark[200],
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  modalImage: {
    width: 64,
    height: 64,
    marginRight: theme.spacing.md,
  },
  modalTitle: {
    ...themeComposable.typography.h2,
    color: theme.colors.light[100],
    flex: 1,
  },
  modalSubtitle: {
    width: "90%",
    paddingRight: theme.spacing.md,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalTier: {
    ...themeComposable.typography.body,
    fontWeight: "600",
  },
  modalDescription: {
    ...themeComposable.typography.body,
    color: theme.colors.light[300],
  },
  modalDate: {
    ...themeComposable.typography.bodyBold,
    color: theme.colors.light[300],
    fontSize: 12,
  },
  progressSection: {
    marginTop: theme.spacing.md,
  },
  progressHeader: {
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  progressLabel: {
    ...themeComposable.typography.bodySmall,
    color: theme.colors.light[400],
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: theme.colors.dark[400],
    borderRadius: theme.borderRadius.full,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: theme.borderRadius.full,
  },
});
