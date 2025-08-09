import { Response } from 'express';

import { ValidationError, CustomApiException } from '#core_util/errors.util.js';

/**
 * Send a standardized JSON response.
 */
function sendResponse(res: Response, data: {} = {}, message:string = "OK", status:boolean | string = true, error:{}[] = [], statusCode:number = 200) {
  return res.status(statusCode).json({
    status,
    message,
    response_data: data,
    error_data:   error,
  });
}

/**
 * Centralized exception handler.  
 * ValidationError, DB errors, and CustomApiException.
 */
function handleException(res: Response, error) {

  // for validation error
  if (error instanceof ValidationError) {
    return sendResponse(res, {}, error.message, false, error.errors, 422);
  }

  // for database error
  if (error.name === "SequelizeDatabaseError" || error.name === "MongoError") {
    const errorData = process.env.NODE_ENV === "development"
                        ? { stack: error.stack, message: error?.message ?? null }
                        : [];
    return sendResponse(res, {}, "Something went wrong", false, errorData, 500);
  }

  // for custome error
  if (error instanceof CustomApiException) {
    return sendResponse(res, {}, error.message, false, error.details, error.status);
  }

  // fallback
  const errorData = process.env.NODE_ENV === "development"
                      ? { message: error.message, stack: error.stack }
                      : [];
  return sendResponse(res, {}, "Something went wrong", false, errorData, 500);
}

/**
 * Throw a generic API exception (default 403).
 */
function triggerError(message: string, details:{} = {}, statusCode:number = 403): never {
  throw new CustomApiException(message, statusCode, details);
}

/**
 * Throw a validation exception (422).
 */
function triggerValidationError(details:{} = {}) {
  throw new ValidationError(details);
}

function returnNotFound(res: Response, message='Not Found') {
  sendResponse(res, {}, message, false, [], 404);
}

export {
  sendResponse,
  handleException,
  triggerError,
  triggerValidationError,
  returnNotFound,
};