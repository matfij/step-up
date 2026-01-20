import { StyleSheet, Text, View } from "react-native";
import { ModalWrapper } from "./modal-wrapper";
import { useTranslation } from "react-i18next";
import { AppButton, AppButtonSecondary } from "./app-button";
import { theme } from "../theme";

interface ConfirmModalProps {
  message: string;
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal = (props: ConfirmModalProps) => {
  const { t } = useTranslation();

  return (
    <ModalWrapper visible={props.visible} onClose={props.onClose}>
      <View style={styles.modalContent}>
        <Text style={styles.mainLabel}>{props.message}</Text>
        <View style={styles.actionsWrapper}>
          <AppButtonSecondary
            label={t("common.cancel")}
            onClick={props.onClose}
            style={{ width: "45%", marginVertical: theme.spacing.md }}
          />
          <AppButton
            label={t("common.confirm")}
            onClick={props.onConfirm}
            style={{
              width: "45%",
              paddingVertical: theme.spacing.xs,
              marginVertical: theme.spacing.md,
              borderRadius: theme.borderRadius.sm,
            }}
            textStyle={{
              fontSize: 16,
              lineHeight: 24,
            }}
          />
        </View>
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: theme.colors.dark[400],
  },
  mainLabel: {
    fontSize: 20,
    color: theme.colors.light[200],
    fontWeight: 600,
    textAlign: "center",
    padding: theme.spacing.md,
  },
  actionsWrapper: {
    height: 60,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.md,
  },
});
