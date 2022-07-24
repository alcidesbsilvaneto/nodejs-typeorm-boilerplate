import ApiError from "@modules/Error/ApiError";
import { PermissionRepository } from "src/repositories";

type CreateRequestPayload = {
  name: string;
  description: string;
};

class PermissionController {
  async create({ name, description }: CreateRequestPayload) {
    const permissionRepo = PermissionRepository();

    if (await permissionRepo.findOne({ where: { name } })) {
      throw new ApiError("permission-already-exists", "Uma permissão com este nome já existe.", 400, true);
    }

    const permission = permissionRepo.create({ name, description });
    await permissionRepo.save(permission);
    return permission;
  }

  async list() {
    const permissionRepo = PermissionRepository();
    return await permissionRepo.find();
  }
}

export default new PermissionController();
