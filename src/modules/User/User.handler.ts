import ApiError, { handleError } from "@modules/Error/ApiError";
import logger from "@utils/logger";
import { Request, Response } from "express";
import { UserRepository } from "src/repositories";
import UserController from "./User.controller";
import User from "./User.model";

class UserHandler {
  async handleCreate(req: Request, res: Response) {
    const { name, email, password } = req.body;
    try {
      const user = await UserController.create({ name, email, password });
      res.status(201).json({ ok: true, user });
    } catch (error) {
      return handleError(error, res);
    }
  }

  async handleAclUpdateRequest(req: Request, res: Response) {
    const userRepo = UserRepository();
    const { roles_ids, permissions_ids, user_id } = req.body;
    const requestingUser = res.locals.user as User;

    // Checking if target user exists
    let targetUser = null as User | null;
    try {
      const userExists = await userRepo.findOne({ where: { id: user_id } });
      if (!userExists) throw new ApiError("user-not-found", "Usuário não encontrado", 404);
      targetUser = userExists;
    } catch (error) {
      return handleError(error, res);
    }

    if (roles_ids?.length > 0) {
      try {
        await UserController.updateAclRoles({ user: targetUser, roles_ids });
        logger.info(`[UserHandler] | User ${requestingUser.id} updated user ${targetUser.id} ACL roles to ${roles_ids} `);
      } catch (error) {
        logger.error({
          err: error,
          customMessage: `[UserHandler] | User ${requestingUser.id} failed to update user ${targetUser.id} ACL roles | src/modules/User/User.handler.ts handleAclUpdateRequest() error `,
        });
        return handleError(error, res);
      }
    }
    if (permissions_ids?.length > 0) {
      try {
        await UserController.updateAclPermissions({ user: targetUser, permissions_ids });
        logger.info(`[UserHandler] | User ${requestingUser.id} updated user ${targetUser.id} ACL permissions to ${permissions_ids}`);
      } catch (error) {
        logger.error({
          err: error,
          customMessage: `[UserHandler] | User ${requestingUser.id} failed to update user ${targetUser.id} ACL permissions | src/modules/User/User.handler.ts handleAclUpdateRequest() error `,
        });
        return handleError(error, res);
      }
    }

    return res.status(200).json({ ok: true });
  }

  async handleListPermissions(req: Request, res: Response) {
    const { user_id } = req.body;
    const requestingUser = res.locals.user as User;
    const userRepo = UserRepository();
    try {
      if (requestingUser.permissions.map((p) => p.name).includes("list-other-users-permissions")) {
        // User can list permissions of other users
        const user = await userRepo.findOne({ where: { id: user_id }, relations: ["permissions"] });
        if (!user) throw new ApiError("user-not-found", "Usuário não encontrado", 404);
        return res.status(200).json({ ok: true, permissions: user.permissions });
      } else {
        // User can list only his permissions
        return res.status(200).json({ ok: true, permissions: requestingUser.permissions });
      }
      const permissions = await UserController.listPermissions({ user: requestingUser });
    } catch (error) {}
  }
}

export default new UserHandler();
