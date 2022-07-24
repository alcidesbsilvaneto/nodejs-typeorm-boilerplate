import ApiError from "@modules/Error/ApiError";
import AppDataSource from "@services/Database";
import User from "./User.model";
import bcrypt from "bcryptjs";

class UserHelper {
  async checkEmailAndGeneratePassword(user: User) {
    const checkEmail = await AppDataSource.manager.findOne(User, { where: { email: user.email } });
    if (checkEmail) throw new ApiError("email-already-in-use", "Este email já está em uso", 400);
    user.password_hash = this.hashPassword(user.password_hash);
  }

  checkPassword(user: User, unencryptedPassword: string): boolean {
    return bcrypt.compareSync(unencryptedPassword, user.password_hash);
  }

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }
}

export default new UserHelper();
