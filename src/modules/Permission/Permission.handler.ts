import { handleError } from "@modules/Error/ApiError";
import logger from "@utils/logger";
import { Request, Response } from "express";
import PermissionController from "./Permission.controller";

class PermissionHandler {
  async handleCreateRequest(req: Request, res: Response) {
    const { name, description } = req.body;
    try {
      const permission = await PermissionController.create({ name, description });
      res.status(201).json(permission);
    } catch (error) {
      logger.error({
        err: error,
        req: req.body,
        customMessage: "[PermissionHandler] | Error creating permission | src/modules/Permission/Permission.handler.ts handleCreateRequest() ",
      });
      return handleError(error, res);
    }
  }

  async handleListRequest(req: Request, res: Response) {
    try {
      const permissions = await PermissionController.list();
      res.status(200).json(permissions);
    } catch (error) {
      logger.error({
        err: error,
        req: req.body,
        customMessage: "[PermissionHandler] | Error listing permission | src/modules/Permission/Permission.handler.ts handleListRequest() ",
      });
      return handleError(error, res);
    }
  }
}

export default new PermissionHandler();
