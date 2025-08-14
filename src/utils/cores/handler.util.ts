import { Response } from 'express';
import { ValidationError, CustomApiException } from '#core_util/errors.util.js';
import { getEnvorThrow } from '../mains/general.util.js';

const NODE_ENV = getEnvorThrow("NODE_ENV");

/**
 * Send a standardized JSON response.
 */
function sendResponse(
  res: Response, data: unknown = {}, 
  message:string = "OK", 
  status:boolean | string = true, 
  error: unknown = {}, 
  statusCode:number = 200
) {
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
function handleException(res: Response, error: unknown) {
  // for validation error
  if (error instanceof ValidationError) {
    return sendResponse(res, {}, error.message, false, error.errors, 422);
  }

  // for database error
  if (isErrorWithName(error, "SequelizeDatabaseError") || isErrorWithName(error, "MongoError")) {
    const errorData = NODE_ENV === "development"
                      ? { stack: error.stack, message: error.message }
                      : [];
    return sendResponse(res, {}, "Something went wrong", false, errorData, 500);
  }

  // for custom error
  if (error instanceof CustomApiException) {
    return sendResponse(res, {}, error.message, false, error.details, error.status);
  }

  // fallback
  if (error instanceof Error) {
    const errorData = NODE_ENV === "development"
                      ? { message: error.message, stack: error.stack }
                      : [];
    return sendResponse(res, {}, "Something went wrong", false, errorData, 500);
  }

  // if error is not even an Error object
  return sendResponse(res, {}, "Something went wrong", false, [], 500);
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
function triggerValidationError(details: unknown) {
  throw new ValidationError(details);
}

function returnNotFound(res: Response, message='Not Found') {
  sendResponse(res, {}, message, false, [], 404);
}

// Helper type guard
function isErrorWithName(err: unknown, name: string): err is Error & { name: string } {
  return err instanceof Error && err.name === name;
}

export {
  sendResponse,
  handleException,
  triggerError,
  triggerValidationError,
  returnNotFound,
};