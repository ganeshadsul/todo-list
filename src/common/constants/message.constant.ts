export const USER_MESSAGES = {
  CREATED: 'User created successfully.',
  FOUND_ALL: 'Users found.',
  FOUND_ONE: 'User found.',
  UPDATED: 'User updated successfully.',
  PATCHED: 'User details patched successfully.',
  DELETED: 'User deleted successfully.',
  NOT_FOUND: (value: string) => `User not found at id ${value}.`,
} as const;

export const SUCCESS = 'success';

export const AUTH_MESSAGES = {
  SUCCES: 'Login successful.',
  INVALID: 'Invalid credentials.',
  TOKEN_INVALID: 'Invalid token / Token expired.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  TOKEN_REQUIRED: 'Authentication token is required.',
};
