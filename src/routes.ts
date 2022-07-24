import { Router } from "express";
import AuthenticationRoutes from "@services/Authentication/Authentication.routes";
import PermissionRoutes from "@modules/Permission/Permission.routes";
import UserRoutes from "@modules/User/User.routes";
import RoleRoutes from "@modules/Role/Role.routes";

const routes = Router();

routes.use("/user", UserRoutes());
routes.use("/authentication", AuthenticationRoutes());
routes.use("/permission", PermissionRoutes());
routes.use("/role", RoleRoutes());

export default routes;
