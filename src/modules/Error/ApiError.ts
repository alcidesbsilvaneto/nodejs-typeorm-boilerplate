import logger from "@utils/logger";
import { Response } from "express";

class ApiError extends Error {
  userMessage: string;
  statusCode: number;
  isUserError?: boolean;

  constructor(message: string, userMessage: string, statusCode: number, isUserError?: boolean) {
    super(message);
    this.userMessage = userMessage;
    this.statusCode = statusCode;
    this.isUserError = isUserError;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export function handleError(err: Error | ApiError, res: Response) {
  if (err instanceof ApiError) {
    if (!err.isUserError)
      logger.error({
        err,
        customMessage: "ApiError.ts handleError error (ApiError)",
      });

    if (err.userMessage) {
      return res.status(err.statusCode ?? 500).send({
        ok: false,
        message: err.message,
        userMessage: err.userMessage,
      });
    } else if (err.message) {
      return res.status(err.statusCode ?? 500).send({ ok: false, message: err.message });
    } else {
      return res.status(err.statusCode ?? 500).send({
        ok: false,
        message: "unknown-error",
        userMessage: "Erro desconhecido",
      });
    }
  } else {
    logger.error({
      err,
      stack: err.stack,
      customMessage: "ApiError.ts handleError error (Unknown error type)",
      requestId: res.getHeader("x-Request-Id"),
    });
    if (res) {
      if (err.message) {
        return res.status(500).send({ ok: false, message: err.message });
      } else {
        return res.status(500).send({
          ok: false,
          message: "unknown-error",
          userMessage: "Erro desconhecido",
        });
      }
    }
  }
}

export default ApiError;
