import { validateSanitizedRequest } from "@middlewares/index";
import { RequestHandler } from "express";
import { body } from "express-validator";

class PermissionValidator {
  validateCreateRequest: RequestHandler[] = [
    body("name")
      .notEmpty()
      .withMessage({ message: "missing-name", userMessage: "Nome obrigatório" })
      .isString()
      .withMessage({ message: "invalid-name", userMessage: "Nome deve ser uma string" }),
    body("description")
      .notEmpty()
      .withMessage({ message: "missing-description", userMessage: "Descrição obrigatória" })
      .isString()
      .withMessage({ message: "invalid-description", userMessage: "Descrição deve ser uma string" }),
    validateSanitizedRequest,
  ];
}

export default new PermissionValidator();
