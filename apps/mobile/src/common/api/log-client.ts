import { ApiClient } from "./api-client";
import { ApiError, LogType } from "./api-definitions";

export class LogClient extends ApiClient {
  log = async (params: {
    type: LogType;
    userId?: string;
    details?: string;
  }): Promise<{ error?: ApiError }> =>
    this.request("/logs", { method: "POST", body: JSON.stringify(params) });
}

export const logClient = new LogClient();
