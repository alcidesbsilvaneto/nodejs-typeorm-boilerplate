import { validateSanitizedRequest } from "@middlewares/index";
import { RequestHandler } from "express";
import { body, param } from "express-validator";

class RoleValidator {
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

  validateUpdatePermissionsRequest: RequestHandler[] = [
    param("role_id").isInt().withMessage({ message: "invalid-role_id", userMessage: "ID do grupo de permissões deve ser um inteiro" }),
    body("permissions_ids")
      .isArray()
      .withMessage({ message: "invalid-permissions-ids", userMessage: "Objeto de ids inválido" })
      .custom((v: []) => v.every((id: any) => typeof id === "number"))
      .withMessage({ message: "invalid-permissions-ids", userMessage: "Objeto de ids inválido" }),
    validateSanitizedRequest,
  ];
}

export default new RoleValidator();
