import ApiError, { handleError } from "@modules/Error/ApiError";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRepository } from "src/repositories";
import { AuthenticationResponsePayload } from "./Authentication.controller";

export const ensureAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.headers.authorization;
  const userRepo = UserRepository();
  if (!authHeaders) {
    return res.status(401).json({ ok: false, message: "missing-token", userMessage: "Este recurso requer autenticação" });
  }

  const [, token] = authHeaders.split(" ");
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const { user_id } = jwt.decode(token) as AuthenticationResponsePayload;
    const user = await userRepo.findOne({ where: { id: user_id }, relations: ["permissions", "roles"] });
    res.locals.user = user;
    return next();
  } catch (error) {
    if (error.message === "jwt expired") error = new ApiError("token-expired", "Token expirado", 401, true);
    if (error.message === "invalid signature") error = new ApiError("invalid-token", "Token inválido", 401, true);
    return handleError(error, res);
  }
};
