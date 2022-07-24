import ApiError, { handleError } from "@modules/Error/ApiError";
import logger from "@utils/logger";
import { Request, Response } from "express";
import { RoleRepository } from "src/repositories";
import RoleController from "./Role.controller";

class RoleHandler {
  async handleCreateRequest(req: Request, res: Response) {
    const { name, description } = req.body;
    try {
      const role = await RoleController.create({ name, description });
      res.status(201).json(role);
    } catch (error) {
      logger.error({
        err: error,
        req: req.body,
        customMessage: "[RoleHandler] | Error creating role | src/modules/Role/Role.handler.ts handleCreateRequest() ",
      });
      return handleError(error, res);
    }
  }

  async handleListRequest(req: Request, res: Response) {
    try {
      const roles = await RoleController.list();
      res.status(200).json(roles);
    } catch (error) {
      logger.error({
        err: error,
        req: req.body,
        customMessage: "[RoleHandler] | Error listing roles | src/modules/Role/Role.handler.ts handleListRequest() ",
      });
      return handleError(error, res);
    }
  }

  async handleUpdatePermissionsRequest(req: Request, res: Response) {
    const { role_id } = req.params;
    const { permissions_ids } = req.body;
    const roleRepository = RoleRepository();
    try {
      const role = await roleRepository.findOne({ where: { id: +role_id } });
      if (!role) throw new ApiError("role-not-found", "Grupo de permissões não encontrado", 404);
      const updatedRole = await RoleController.updatePermissions({ role, permissions_ids });
      logger.info(`[RoleHandler] | Role ${role_id} updated permissions to ${permissions_ids}`);
      res.status(200).json({ ok: true, role: updatedRole });
    } catch (error) {
      logger.error({
        err: error,
        req: req.body,
        customMessage: "[RoleHandler] | Error updating permissions | src/modules/Role/Role.handler.ts handleUpdatePermissionsRequest() ",
      });
      return handleError(error, res);
    }
  }
}

export default new RoleHandler();
