import { Modal, StyleSheet, Text, View, ScrollView } from "react-native";
import { ActivityReport } from "./definitions";
import { useTranslation } from "react-i18next";
import { withAlpha } from "../../common/utils";
import { theme, themeComposable } from "../../common/theme";
import {
  AppButton,
  AppButtonSecondary,
} from "../../common/components/app-button";
import { formatDuration } from "./time-manager";
import { AppInputLight } from "../../common/components/app-input";
import { useState } from "react";

type ActivityReportModalProps = {
  visible: boolean;
  report: ActivityReport;
  onDiscard: () => void;
};

export const ActivityReportModal = (props: ActivityReportModalProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const onSave = () => {};

  return (
    <Modal visible={props.visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.modalWrapper}>
          <View style={styles.header}>
            <View style={styles.successIcon}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
            <Text style={styles.title}>{t("activity.completed")}</Text>
            <Text style={styles.subtitle}>{t("activity.completedHint.0")}</Text>
          </View>

          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>
                {t("activity.activityDetails")}
              </Text>
              <View style={styles.inputWrapper}>
                <AppInputLight
                  value={name}
                  label={t("activity.name")}
                  onChange={setName}
                />
                <AppInputLight
                  value={description}
                  label={t("activity.description")}
                  onChange={setDescription}
                />
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {formatDuration(props.report.duration)}
                </Text>
                <Text style={styles.statLabel}>{t("activity.duration")}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{props.report.distance}</Text>
                <Text style={styles.statLabel}>{t("activity.distance")}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {props.report.averageSpeed}
                </Text>
                <Text style={styles.statLabel}>
                  {t("activity.averageSpeed")}
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{props.report.topSpeed}</Text>
                <Text style={styles.statLabel}>{t("activity.topSpeed")}</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonWrapper}>
            <AppButton
              label={t("common.save")}
              onClick={onSave}
              style={styles.saveButton}
            />
            <AppButtonSecondary
              label={t("common.discard")}
              onClick={props.onDiscard}
              style={styles.discardButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: withAlpha(theme.colors.dark[700], theme.opacity.glass),
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  modalWrapper: {
    ...themeComposable.shadows.xl,
    backgroundColor: theme.colors.light[100],
    borderRadius: theme.borderRadius.xl,
    width: "100%",
    maxWidth: 420,
    maxHeight: "90%",
    overflow: "hidden",
  },
  header: {
    alignItems: "center",
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    backgroundColor: withAlpha(theme.colors.primary[500], theme.opacity.mist),
    borderBottomColor: withAlpha(theme.colors.primary[500], theme.opacity.mist),
    borderBottomWidth: 1,
  },
  successIcon: {
    ...themeComposable.shadows.primaryLg,
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary[500],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  checkmark: {
    fontSize: 36,
    fontWeight: "bold",
    color: theme.colors.dark[700],
  },
  title: {
    ...themeComposable.typography.h1,
    color: theme.colors.dark[700],
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...themeComposable.typography.body,
    color: theme.colors.light[500],
  },
  scrollContent: {
    flexGrow: 0,
    flexShrink: 1,
  },
  scrollContentContainer: {
    paddingBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    borderWidth: 1,
    padding: theme.spacing.md,
    backgroundColor: withAlpha(theme.colors.primary[700], theme.opacity.mist),
    borderRadius: theme.borderRadius.lg,
    borderColor: withAlpha(theme.colors.primary[700], theme.opacity.liquid),
  },
  statValue: {
    ...themeComposable.typography.h2,
    color: theme.colors.primary[700],
    marginBottom: theme.spacing.xs,
    fontWeight: "800",
  },
  statLabel: {
    ...themeComposable.typography.bodySmall,
    color: theme.colors.light[700],
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  inputSection: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  sectionTitle: {
    ...themeComposable.typography.bodyBold,
    color: theme.colors.dark[700],
    marginBottom: theme.spacing.md,
    fontSize: 15,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputWrapper: {
    gap: theme.spacing.md,
  },
  buttonWrapper: {
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.light[300],
    backgroundColor: theme.colors.light[200],
  },
  saveButton: {
    width: "100%",
  },
  discardButton: {
    width: "100%",
  },
});
