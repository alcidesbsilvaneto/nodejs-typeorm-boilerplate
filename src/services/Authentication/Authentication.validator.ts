import { validateSanitizedRequest } from "@middlewares/index";
import { RequestHandler } from "express";
import { body } from "express-validator";

class AuthenticationValidator {
  validateLoginRequest(): RequestHandler[] {
    return [
      body("email")
        .notEmpty()
        .withMessage({ message: "missing-email", userMessage: "Email obrigatório" })
        .isEmail()
        .withMessage({ message: "invalid-email", userMessage: "Email inválido" })
        .trim(),
      body("password")
        .notEmpty()
        .withMessage({ message: "missing-password", userMessage: "Senha obrigatória" })
        .isLength({ min: 6 })
        .withMessage({ message: "invalid-password", userMessage: "Senha deve ter no mínimo 6 caracteres" }),
      validateSanitizedRequest,
    ];
  }

  validatePasswordResetTokenRequest(): RequestHandler[] {
    return [
      body("email")
        .notEmpty()
        .withMessage({ message: "missing-email", userMessage: "Email obrigatório" })
        .isEmail()
        .withMessage({ message: "invalid-email", userMessage: "Email inválido" })
        .trim(),
      validateSanitizedRequest,
    ];
  }

  validatePasswordResetRequest(): RequestHandler[] {
    return [
      body("token").notEmpty().withMessage({ message: "missing-token", userMessage: "Token obrigatório" }).trim(),
      body("password")
        .notEmpty()
        .withMessage({ message: "missing-password", userMessage: "Senha obrigatória" })
        .isLength({ min: 6 })
        .withMessage({ message: "invalid-password", userMessage: "Senha deve ter no mínimo 6 caracteres" }),
      validateSanitizedRequest,
    ];
  }
}

export default new AuthenticationValidator();
