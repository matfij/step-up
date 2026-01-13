import {
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { withAlpha } from "../utils";
import { theme, themeComposable } from "../theme";
import { ReactNode } from "react";

export interface ModalWrapperProps {
  visible: boolean;
  children: ReactNode;
  onClose: () => void;
  style?: StyleProp<ViewStyle>;
}

export const ModalWrapper = (props: ModalWrapperProps) => {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={props.visible}
      onRequestClose={() => props.onClose()}
    >
      <Pressable style={styles.backdrop} onPress={() => props.onClose()}>
        <Pressable
          style={[styles.modalWrapper, props.style]}
          onPress={(e) => e.stopPropagation()}
        >
          {props.children}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: withAlpha(theme.colors.dark[100], theme.opacity.glass),
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.md,
    elevation: 100,
  },
  modalWrapper: {
    ...themeComposable.shadows.xl,
    backgroundColor: theme.colors.light[100],
    borderRadius: theme.borderRadius.xl,
    width: "100%",
    maxWidth: 420,
    maxHeight: "90%",
    overflow: "hidden",
    elevation: 200,
  },
});
