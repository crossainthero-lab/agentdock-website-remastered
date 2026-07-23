export interface WaitlistRequest {
  name: string;
  email: string;
  useCase?: string;
  website?: string;
}

export interface WaitlistSuccessResponse {
  ok: true;
  alreadyJoined: boolean;
  message: string;
}

export interface WaitlistErrorResponse {
  ok: false;
  error: string;
}

export type WaitlistResponse = WaitlistSuccessResponse | WaitlistErrorResponse;

export const WAITLIST_API_URL = "/api/waitlist";
