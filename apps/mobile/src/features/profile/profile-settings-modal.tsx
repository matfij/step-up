import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ModalWrapper } from "../../common/components/modal-wrapper";
import { theme, themeComposable } from "../../common/theme";
import { useTranslation } from "react-i18next";
import {
  AppButton,
  AppButtonSecondary,
} from "../../common/components/app-button";
import { AppInput } from "../../common/components/app-input";
import { useUserStore } from "../../common/state/user-store";
import { ApiError, ApiFile } from "../../common/api/api-definitions";
import { AppApiError } from "../../common/components/app-api-error";
import { appConfig } from "../../common/config";
import { useRequest } from "../../common/api/use-request";
import { userClient } from "../../common/api/user-client";
import { usePickAvatar } from "./use-pick-avatar";

interface ProfileSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ProfileSettingsModal = (props: ProfileSettingsModalProps) => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const [username, setUsername] = useState(user?.username ?? "");
  const pickAvatar = usePickAvatar();
  const updateAvatar = useRequest(userClient.uploadAvatar);

  useEffect(() => {
    if (updateAvatar.success) {
      console.log("TODO (M#122) - success notification");
      pickAvatar.reset();
      props.onClose();
    }
  }, [updateAvatar.success]);

  const onConfirm = () => {
    console.log("TODO (M#104) - full profile update");
    if (!pickAvatar.avatar || pickAvatar.error) {
      return;
    }
    updateAvatar.call(pickAvatar.avatar);
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
          {pickAvatar.avatar && (
            <Image src={pickAvatar.avatar.uri} style={styles.avatarImage} />
          )}
          <AppButton
            label={t("profile.chooseAvatar")}
            onClick={pickAvatar.pick}
            style={styles.smallButton}
            textStyle={styles.smallButtonText}
          />
        </View>

        <View style={styles.actionsWrapper}>
          <AppApiError
            message={pickAvatar.error}
            error={updateAvatar.error}
            style={styles.errorWrapper}
          />
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
  avatarImage: {
    width: 100,
    height: 100,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
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
  errorWrapper: {
    marginTop: -theme.spacing.xs,
    marginBottom: -theme.spacing.sm,
  },
});
