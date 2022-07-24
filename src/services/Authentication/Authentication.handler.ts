import { handleError } from "@modules/Error/ApiError";
import { Request, Response } from "express";
import AuthenticationController from "./Authentication.controller";

class AuthenticationHandler {
  async handleAuthenticate(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const result = await AuthenticationController.authenticate({ email, password });
      return res.status(200).json({ ok: true, ...result });
    } catch (error) {
      return handleError(error, res);
    }
  }

  async handleRequestPasswordResetToken(req: Request, res: Response) {
    const { email } = req.body;
    try {
      await AuthenticationController.requestPasswordResetToken(email);
      return res.status(200).json({ ok: true });
    } catch (error) {
      return handleError(error, res);
    }
  }

  async handleResetPassword(req: Request, res: Response) {
    const { token, password } = req.body;
    try {
      await AuthenticationController.resetPassword(token, password);
      return res.status(200).json({ ok: true });
    } catch (error) {
      return handleError(error, res);
    }
  }
}

export default new AuthenticationHandler();
