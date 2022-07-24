import { is } from "@services/Acl/Acl.middlewares";
import { ensureAuthenticated } from "@services/Authentication/Authentication.middlewares";
import { Router } from "express";
import UserHandler from "./User.handler";
import UserValidator from "./User.validator";

export default (): Router => {
  const routes = Router();

  routes.post(`/`, UserValidator.validateCreateRequest, UserHandler.handleCreate);

  routes.post(`/:user_id/acl`, ensureAuthenticated, is(["master"]), UserValidator.validateUpdateAclRequest, UserHandler.handleAclUpdateRequest);

  routes.get(`/permissions`, ensureAuthenticated, is(["master"]), UserHandler.handleListPermissions);
  return routes;
};
