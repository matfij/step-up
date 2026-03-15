import { useState } from "react";
import { ProfileComponent } from "../../features/profile/profile-component";
import { RefreshControl, ScrollView } from "react-native";
import { generateRandomString } from "../../common/utils";

const initialKey = generateRandomString();

export default function Index() {
  const [refreshKey, setRefreshKey] = useState(initialKey);

  const onRefresh = async () => {
    setRefreshKey(generateRandomString());
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} />
      }
    >
      <ProfileComponent key={refreshKey} />
    </ScrollView>
  );
}
