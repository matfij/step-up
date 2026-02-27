import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { ApiFile } from "../../common/api/api-definitions";
import { appConfig } from "../../common/config";

export const usePickAvatar = () => {
  const [avatar, setAvatar] = useState<ApiFile>();
  const [error, setError] = useState<string>();

  const pick = async () => {
    setError(undefined);

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      setError("profile.mediaPermissionRequired");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
    });

    if (result.canceled) {
      return;
    }

    const newAvatar = result.assets[0];

    if (
      newAvatar.fileSize &&
      newAvatar.fileSize > appConfig.validation.avatarMaxSize
    ) {
      setError("profile.avatarTooLarge");
      return;
    } else if (
      !newAvatar.fileName ||
      !newAvatar.mimeType ||
      !appConfig.validation.avatarExtensions.includes(
        newAvatar.mimeType as "image/jpeg" | "image/png",
      )
    ) {
      setError("profile.avatarFileInvalid");
      return;
    }

    setAvatar({
      uri: newAvatar.uri,
      fileName: newAvatar.fileName,
      mimeType: newAvatar.mimeType,
    });
  };

  const reset = () => {
    setAvatar(undefined);
    setError(undefined);
  };

  return {
    avatar,
    error,
    pick,
    reset,
  };
};
