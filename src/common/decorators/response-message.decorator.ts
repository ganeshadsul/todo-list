// src/common/decorators/response-message.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSAGE = 'response_message';

// Make sure this is a function that RETURNS the SetMetadata call
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE, message);
