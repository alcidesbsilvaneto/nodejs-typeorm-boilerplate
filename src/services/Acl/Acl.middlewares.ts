import User from "@modules/User/User.model";
import { NextFunction, Request, Response } from "express";
import { RoleRepository } from "src/repositories";
import { In } from "typeorm";

export const checkPermissions = (permissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user as User;

    // Fetching permissions to compare against user's roles individual permissions
    const roleRepository = RoleRepository();
    const rolesIds = user.roles.map((role) => role.id);
    const roles = await roleRepository.find({ where: { id: In(rolesIds) }, relations: ["permissions"] });
    const rolesPermissions = roles.reduce((permissions, role) => [...permissions, ...role.permissions], []);

    if (!user.permissions.map((p) => p.name).some((p) => permissions.includes(p)) && !rolesPermissions.map((p) => p.name).some((p) => permissions.includes(p))) {
      return res.status(401).json({ ok: false, message: "forbidden", userMessage: "Você não tem permissão para acessar este recurso" });
    }
    return next();
  };
};

export const is = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user as User;
    if (!user.roles.map((p) => p.name).some((p) => roles.includes(p))) {
      return res.status(401).json({ ok: false, message: "forbidden", userMessage: "Você não tem permissão para acessar este recurso" });
    }
    return next();
  };
};
