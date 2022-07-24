import { checkPermissions, is } from "@services/Acl/Acl.middlewares";
import { ensureAuthenticated } from "@services/Authentication/Authentication.middlewares";
import { Router } from "express";
import RoleHandler from "./Role.handler";
import RoleValidator from "./Role.validator";

export default (): Router => {
  const routes = Router();

  routes.post(`/`, ensureAuthenticated, is(["master"]), RoleValidator.validateCreateRequest, RoleHandler.handleCreateRequest);

  routes.get(`/`, ensureAuthenticated, is(["master"]), RoleHandler.handleListRequest);

  routes.post(`/:role_id/permissions`, ensureAuthenticated, is(["master"]), RoleValidator.validateUpdatePermissionsRequest, RoleHandler.handleUpdatePermissionsRequest);

  return routes;
};
