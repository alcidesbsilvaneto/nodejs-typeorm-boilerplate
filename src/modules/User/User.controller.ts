import User from "./User.model";
import { PermissionRepository, RoleRepository, UserRepository } from "src/repositories";
import { In } from "typeorm";
import Permission from "@modules/Permission/Permission.model";

type CreateRequestPayload = {
  name: string;
  email: string;
  password: string;
};

type UpdateAclRolesRequestPayload = {
  user: User;
  roles_ids?: number[];
};

type UpdateAclPermissionsRequestPayload = {
  user: User;
  permissions_ids?: number[];
};

class UserController {
  async create({ name, email, password }: CreateRequestPayload): Promise<User> {
    const repo = UserRepository();
    const user = repo.create({ name, email, password_hash: password });
    await repo.save(user);
    user.password_hash = null; // Avoid sending password_hash to client
    return user;
  }

  async updateAclRoles({ user, roles_ids }: UpdateAclRolesRequestPayload): Promise<User> {
    const roleRepo = RoleRepository();
    const userRepo = UserRepository();
    const roles = await roleRepo.find({ where: { id: In(roles_ids) } });
    user.roles = roles;
    await userRepo.save(user);
    return user;
  }

  async updateAclPermissions({ user, permissions_ids }: UpdateAclPermissionsRequestPayload): Promise<User> {
    const userRepo = UserRepository();
    const permissionRepo = PermissionRepository();
    const permissions = await permissionRepo.find({ where: { id: In(permissions_ids) } });
    user.permissions = permissions;
    await userRepo.save(user);
    return user;
  }

  async listPermissions({ user }): Promise<Permission[]> {
    const userRepo = UserRepository();
    // Fetching user again to ensure that permissions are loaded
    const dbUser = await userRepo.findOne({ where: { id: user.id }, relations: ["permissions"] });
    return dbUser.permissions;
  }
}

export default new UserController();
