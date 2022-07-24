import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";

export async function injectRequestUuid(req: Request, res: Response, next: NextFunction) {
  req.headers["X-Request-Id"] = uuidv4();
  res.setHeader("X-Request-Id", req.headers["X-Request-Id"]);
  next();
}

export async function validateSanitizedRequest(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.dir(errors, { depth: null });
    return res.status(400).json({ ok: false, ...errors.array()[0].msg });
  } else {
    next();
  }
}

export async function handle404(req: Request, res: Response) {
  res.status(404).json({ ok: false, message: 'endpoint-not-found', userMessage: `Endpoint não encontrado` });
}
