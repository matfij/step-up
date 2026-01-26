import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { activityClient } from "../../common/api/activity-client";
import { Activity } from "../../common/api/api-definitions";
import { useRequest } from "../../common/api/use-request";
import { ModalWrapper } from "../../common/components/modal-wrapper";
import { theme, themeComposable } from "../../common/theme";
import { ActivityComponent } from "./activity-component";

interface ActivityModalProps {
  userId?: string;
  visible: boolean;
  onClose: () => void;
}

const pageSize = 3;

export const ActivitiesModal = (props: ActivityModalProps) => {
  const { t } = useTranslation();
  const getActivities = useRequest(activityClient.getByUserId);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (props.visible) {
      setActivities([]);
      setSkip(0);
      setHasMore(true);
      loadActivities(0);
    }
  }, [props.userId, props.visible]);

  const loadActivities = async (currentSkip: number) => {
    if (!props.userId || (!hasMore && currentSkip > 0)) {
      return;
    }
    await getActivities.call({
      userId: props.userId,
      skip: currentSkip,
      take: pageSize,
    });
  };

  useEffect(() => {
    if (getActivities.success && getActivities.data) {
      if (getActivities.data.length < pageSize) {
        setHasMore(false);
      }
      setActivities((prev) =>
        skip === 0 ? getActivities.data! : [...prev, ...getActivities.data!],
      );
    }
  }, [getActivities.success, getActivities.data]);

  const handleLoadMore = () => {
    if (!getActivities.loading && !getActivities.error && hasMore) {
      const nextSkip = skip + pageSize;
      setSkip(nextSkip);
      loadActivities(nextSkip);
    }
  };

  const renderItem = ({ item }: { item: Activity }) => (
    <View style={styles.activityItem}>
      <ActivityComponent activity={item} />
    </View>
  );

  const renderEmpty = () => {
    if (getActivities.loading) {
      return (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size={64} color={theme.colors.primary[500]} />
        </View>
      );
    } else {
      return <Text style={styles.emptyLabel}>{t("profile.noActivities")}</Text>;
    }
  };

  return (
    <ModalWrapper visible={props.visible} onClose={props.onClose}>
      <View style={styles.modalContent}>
        <FlatList
          data={activities}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={renderEmpty}
        />
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: theme.colors.dark[500],
  },
  activityItem: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light[300],
  },
  loadingWrapper: {
    padding: theme.spacing.xl,
  },
  emptyLabel: {
    ...themeComposable.typography.h2,
    padding: theme.spacing.xl,
    color: theme.colors.light[300],
    backgroundColor: theme.colors.dark[300],
    borderRadius: theme.borderRadius.md,
  },
});
