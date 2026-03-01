import { Image, StyleSheet, Text, View } from "react-native";
import { theme, themeComposable } from "../../common/theme";
import { getApiUrl } from "../../common/api/api-client";

interface AvatarComponentProps {
  avatarUri?: string;
  username?: string;
  level?: number;
}

export const AvatarComponent = (props: AvatarComponentProps) => {
  const avatarUri = props.avatarUri
    ? `${getApiUrl()}${props.avatarUri}`
    : undefined;

  return (
    <View style={styles.avatarWrapper}>
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatarImage}
          source={
            avatarUri
              ? { uri: avatarUri }
              : require("@assets/images/avatar.png")
          }
        />
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{props.level}</Text>
        </View>
      </View>
      <Text style={styles.userLabel}>{props.username}</Text>
    </View>
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
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.light[700],
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
});
