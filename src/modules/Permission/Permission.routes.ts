import { is } from "@services/Acl/Acl.middlewares";
import { ensureAuthenticated } from "@services/Authentication/Authentication.middlewares";
import { Router } from "express";
import PermissionHandler from "./Permission.handler";
import PermissionValidator from "./Permission.validator";

export default (): Router => {
  const routes = Router();

  routes.post(`/`, ensureAuthenticated, is(["master"]), PermissionValidator.validateCreateRequest, PermissionHandler.handleCreateRequest);

  routes.get(`/`, ensureAuthenticated, is(["master"]), PermissionHandler.handleListRequest);

  return routes;
};
