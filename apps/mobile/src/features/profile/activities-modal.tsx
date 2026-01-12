import { StyleSheet, Text } from "react-native";
import { ModalWrapper } from "../../common/components/modal-wrapper";
import { useRequest } from "../../common/api/api-hooks";
import { activityClient } from "../../common/api/activity-client";
import { useEffect, useState } from "react";

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
      <Text style={styles.title}>Activities</Text>
      {getActivities.data?.map((activity) => (
        <Text key={activity.id}>
          {activity.name} | {activity.distance}
        </Text>
      ))}
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 600,
    // textTransform: "uppercase",
  },
});
