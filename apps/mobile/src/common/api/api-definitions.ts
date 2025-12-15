export class ApiError extends Error {
  constructor(message: string, public key: string, public field?: string) {
    super(message);
  }
}

export interface User {
  id: string;
  email: string;
  username: string;
  apiToken: string;
}
