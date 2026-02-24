import { StyleSheet, Text, View } from "react-native";
import { ModalWrapper } from "../../common/components/modal-wrapper";
import { theme, themeComposable } from "../../common/theme";
import { useTranslation } from "react-i18next";
import {
  AppButton,
  AppButtonSecondary,
} from "../../common/components/app-button";
import { AppInput } from "../../common/components/app-input";
import { useState } from "react";
import { useUserStore } from "../../common/state/user-store";

interface ProfileSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ProfileSettingsModal = (props: ProfileSettingsModalProps) => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const [username, setUsername] = useState(user?.username ?? "");

  const onUploadAvatar = () => {
    console.log("TODO - MOBILE#103");
  };

  const onConfirm = () => {
    console.log("TODO - MOBILE#104");
  };

  return (
    <ModalWrapper visible={props.visible} onClose={props.onClose}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{t("profile.settings")}</Text>
        <AppInput
          label={t("profile.username")}
          value={username}
          onChange={setUsername}
        />
        <View>
          <Text style={styles.avatarLabel}>{t("profile.avatar")}</Text>
          <AppButton
            label={t("profile.chooseAvatar")}
            onClick={onUploadAvatar}
            style={styles.smallButton}
            textStyle={styles.smallButtonText}
          />
        </View>

        <View style={styles.actionsWrapper}>
          <AppButton label={t("common.confirm")} onClick={onConfirm} />
          <AppButtonSecondary
            label={t("common.cancel")}
            onClick={props.onClose}
            style={styles.smallButton}
            textStyle={styles.smallButtonText}
          />
        </View>
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.dark[500],
    gap: theme.spacing.md,
  },
  modalTitle: {
    ...themeComposable.typography.h2,
    color: theme.colors.secondary[100],
  },
  avatarLabel: {
    ...themeComposable.typography.bodySmall,
    marginBottom: theme.spacing.xs,
    fontWeight: 600,
    color: theme.colors.primary[100],
  },
  smallButton: {
    height: 32,
    paddingVertical: theme.spacing.sm,
  },
  smallButtonText: {
    fontSize: 16,
    lineHeight: 18,
  },
  actionsWrapper: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
});
