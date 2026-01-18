import { useState } from "react";
import { ApiError } from "./api-definitions";

export const useRequest = <TArgs, TData>(
  apiCall: (args: TArgs) => Promise<{ data?: TData; error?: ApiError }>,
) => {
  const [data, setData] = useState<TData | undefined>();
  const [error, setError] = useState<ApiError | undefined>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const call = async (args: TArgs) => {
    setData(undefined);
    setError(undefined);
    setLoading(true);
    setSuccess(false);

    try {
      const result = await apiCall(args);
      if (result.data) {
        setData(result.data);
      }
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError({
        name: "Unknown",
        message: "Unknown error",
        key: "errors.unknown",
      });
    }

    setLoading(false);
  };

  return {
    call,
    data,
    error,
    loading,
    success,
  };
};
