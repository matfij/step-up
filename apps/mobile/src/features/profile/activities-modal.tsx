import { StyleSheet, View, FlatList } from "react-native";
import { ModalWrapper } from "../../common/components/modal-wrapper";
import { useRequest } from "../../common/api/api-hooks";
import { activityClient } from "../../common/api/activity-client";
import { useEffect, useState, useCallback } from "react";
import { ActivityComponent } from "./activity-component";
import { theme } from "../../common/theme";
import { Activity } from "../../common/api/api-definitions";

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
        skip === 0 ? getActivities.data! : [...prev, ...getActivities.data!]
      );
    }
  }, [getActivities.success, getActivities.data]);

  const handleLoadMore = () => {
    if (!getActivities.loading && hasMore) {
      const nextSkip = skip + pageSize;
      setSkip(nextSkip);
      loadActivities(nextSkip);
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: Activity }) => (
      <View style={styles.activityItem}>
        <ActivityComponent activity={item} />
      </View>
    ),
    []
  );

  return (
    <ModalWrapper visible={props.visible} onClose={props.onClose}>
      <View style={styles.modalContent}>
        <FlatList
          data={activities}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
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
});
