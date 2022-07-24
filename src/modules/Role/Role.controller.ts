import ApiError from "@modules/Error/ApiError";
import { PermissionRepository, RoleRepository } from "src/repositories";
import { In } from "typeorm";
import Role from "./Role.model";

type CreateRequestPayload = {
  name: string;
  description: string;
};

type UpdatePermissionsRequestPayload = {
  role: Role;
  permissions_ids: number[];
};

class RoleController {
  async create({ name, description }: CreateRequestPayload) {
    const roleRepo = RoleRepository();

    if (await roleRepo.findOne({ where: { name } })) {
      throw new ApiError("role-already-exists", "Um grupo com este nome já existe.", 400, true);
    }

    const role = roleRepo.create({ name, description });
    await roleRepo.save(role);
    return role;
  }

  async list() {
    const roleRepo = RoleRepository();
    return await roleRepo.find({ relations: ["permissions"] });
  }

  async updatePermissions({ role, permissions_ids }: UpdatePermissionsRequestPayload) {
    const roleRepo = RoleRepository();
    const permissionsRepo = PermissionRepository();
    const permissions = await permissionsRepo.findBy({ id: In(permissions_ids) });
    role.permissions = permissions;
    await roleRepo.save(role);
    return role;
  }
}

export default new RoleController();
