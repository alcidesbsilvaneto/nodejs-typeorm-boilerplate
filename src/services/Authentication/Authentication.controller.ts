import ApiError, { handleError } from "@modules/Error/ApiError";
import UserHelper from "@modules/User/User.helper";
import * as jwt from "jsonwebtoken";
import AppDataSource from "@services/Database";
import User from "@modules/User/User.model";
import AuthenticationHelper from "./Authentication.helper";
import { UserRepository } from "src/repositories";
import logger from "@utils/logger";

type AuthenticationRequestPayload = {
  email: string;
  password: string;
};

export type AuthenticationResponsePayload = {
  user_id: number;
  user_name: string;
  user_email: string;
  auth_token: string;
};

class AuthServiceController {
  async authenticate({ email, password }: AuthenticationRequestPayload): Promise<AuthenticationResponsePayload> {
    const user = await AppDataSource.createQueryBuilder(User, "user").where("email = :email", { email }).addSelect(["user.password_hash"]).getOne();
    if (!user) throw new ApiError("user-not-found", "Usuário não existente", 400, true);
    if (!UserHelper.checkPassword(user, password)) throw new ApiError("invalid-password", "Senha inválida", 400, true);
    const authToken = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN ?? "30d",
    });
    return {
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      auth_token: authToken,
    };
  }

  async requestPasswordResetToken(email: string): Promise<void> {
    const userRepository = UserRepository();
    const user = await userRepository.findOne({ where: { email } });
    if (!user) throw new ApiError("user-not-found", "Usuário não existente", 400, true);

    const token = await AuthenticationHelper.generatePasswordResetToken(email);
    await userRepository.update({ id: user.id }, { password_reset_token: token });
    AuthenticationHelper.sendPasswordResetTokenEmail(user.email, user.name, token);
    return;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const userRepository = UserRepository();

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new ApiError("invalid-token", "Token inválido", 400, true);
    }

    const user = await userRepository.findOne({ where: { password_reset_token: token }, select: ["id", "email", "password_reset_token"] });
    if (!user) throw new ApiError("user-not-found", "Usuário não existente", 400, true);

    const passwordHash = UserHelper.hashPassword(newPassword);
    await userRepository.update({ id: user.id }, { password_hash: passwordHash, password_reset_token: null });
    logger.info(`[Authentication] | User ${user.id} reseted password`);
    return;
  }
}

export default new AuthServiceController();
