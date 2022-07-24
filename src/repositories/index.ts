import Permission from "@modules/Permission/Permission.model";
import Role from "@modules/Role/Role.model";
import User from "@modules/User/User.model";
import AppDataSource from "@services/Database";

export const UserRepository = () => AppDataSource.getRepository(User);

export const RoleRepository = () => AppDataSource.getRepository(Role);

export const PermissionRepository = () => AppDataSource.getRepository(Permission);
