export const ROLES = ['CITIZEN', 'MODERATOR', 'ADMIN'] as const;
export type Role = (typeof ROLES)[number];

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const REPORT_STATUSES = [
  'pending',
  'assigned',
  'in_progress',
  'resolved',
  'rejected',
] as const;

export const SEVERITIES = ['low', 'medium', 'high', 'critical'] as const;
export const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;