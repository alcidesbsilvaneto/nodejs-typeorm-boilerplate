import { validateSanitizedRequest } from "@middlewares/index";
import { RequestHandler } from "express";
import { body } from "express-validator";

class UserValidator {
  validateCreateRequest: RequestHandler[] = [
    body("name").notEmpty().withMessage({ message: "missing-name", userMessage: "Nome obrigatório" }),
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

  validateUpdateAclRequest: RequestHandler[] = [
    body("user_id")
      .notEmpty()
      .withMessage({ message: "missing-user-id", userMessage: "ID do usuário obrigatório" })
      .isInt()
      .withMessage({ message: "invalid-user-id", userMessage: "ID do usuário deve ser um número inteiro" }),

    body("roles_ids")
      .optional()
      .isArray()
      .withMessage({ message: "invalid-roles-ids", userMessage: "Objeto de ids inválidos" })
      .custom((v: []) => v.every((id: any) => typeof id === "number"))
      .withMessage({ message: "invalid-roles-ids", userMessage: "Objeto de ids inválidos" }),
    body("permissions_ids")
      .optional()
      .isArray()
      .withMessage({ message: "invalid-permissions-ids", userMessage: "Objeto de ids inválido" })
      .custom((v: []) => v.every((id: any) => typeof id === "number"))
      .withMessage({ message: "invalid-permissions-ids", userMessage: "Objeto de ids inválido" }),
    validateSanitizedRequest,
  ];
}

export default new UserValidator();
