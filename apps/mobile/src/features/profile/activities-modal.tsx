import { StyleSheet, View } from "react-native";
import { ModalWrapper } from "../../common/components/modal-wrapper";
import { useRequest } from "../../common/api/api-hooks";
import { activityClient } from "../../common/api/activity-client";
import { useEffect, useState } from "react";
import { ActivityComponent } from "./activity-component";
import { theme } from "../../common/theme";

interface ActivityModalProps {
  userId: string;
  visible: boolean;
  onClose: () => void;
}

const pageSize = 2;

export const ActivitiesModal = (props: ActivityModalProps) => {
  const getActivities = useRequest(activityClient.getByUserId);
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    getActivities.call({
      userId: props.userId,
      skip: skip,
      take: pageSize,
    });
  }, [props.userId]);

  return (
    <ModalWrapper visible={props.visible} onClose={props.onClose}>
      <View style={styles.modalContent}>
        {getActivities.data &&
          getActivities.data.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <ActivityComponent activity={activity} />
            </View>
          ))}
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.dark[500],
  },
  activityItem: {
    paddingBottom: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light[300],
  },
});
