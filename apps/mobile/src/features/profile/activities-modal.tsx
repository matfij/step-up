import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
} from "react-native";
import { ModalWrapper } from "../../common/components/modal-wrapper";
import { useRequest } from "../../common/api/api-hooks";
import { activityClient } from "../../common/api/activity-client";
import { useEffect, useState, useCallback } from "react";
import { ActivityComponent } from "./activity-component";
import { theme } from "../../common/theme";
import type { Activity } from "../../common/api/api-definitions";

interface ActivityModalProps {
  userId: string;
  visible: boolean;
  onClose: () => void;
}

const pageSize = 10;

export const ActivitiesModal = (props: ActivityModalProps) => {
  const getActivities = useRequest(activityClient.getByUserId);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Load initial data when modal opens
  useEffect(() => {
    if (props.visible) {
      setActivities([]);
      setSkip(0);
      setHasMore(true);
      loadActivities(0);
    }
  }, [props.userId, props.visible]);

  const loadActivities = async (currentSkip: number) => {
    if (!hasMore && currentSkip > 0) return;

    setIsLoadingMore(true);

    const result = await getActivities.call({
      userId: props.userId,
      skip: currentSkip,
      take: pageSize,
    });

    setIsLoadingMore(false);
  };

  useEffect(() => {
    if (getActivities.success && getActivities.data) {
      if (getActivities.data.length < pageSize) {
        setHasMore(false);
      }

      setActivities((prev) =>
        skip === 0 ? getActivities.data! : [...prev, ...getActivities.data!]
      );
    }
  }, [getActivities.success, getActivities.data]);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !getActivities.loading) {
      const nextSkip = skip + pageSize;
      setSkip(nextSkip);
      loadActivities(nextSkip);
    }
  }, [isLoadingMore, hasMore, skip, getActivities.loading]);

  const renderItem = useCallback(
    ({ item }: { item: Activity }) => (
      <View style={styles.activityItem}>
        <ActivityComponent activity={item} />
      </View>
    ),
    []
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.colors.primary[500]} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (getActivities.loading && activities.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No activities yet</Text>
      </View>
    );
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
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={
            activities.length === 0 ? styles.emptyList : undefined
          }
        />
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: theme.colors.dark[500],
    // maxHeight: "80%",
  },
  activityItem: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light[300],
  },
  footer: {
    paddingVertical: theme.spacing.lg,
    alignItems: "center",
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyText: {
    color: theme.colors.light[100],
    fontSize: 16,
  },
});
