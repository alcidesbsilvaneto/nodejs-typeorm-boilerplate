import ApiError from "@modules/Error/ApiError";
import User from "@modules/User/User.model";
import AppDataSource from "@services/Database";
import SendGrid from "@services/Mail/Sendgrid";
import jwt from "jsonwebtoken";

class AuthenticationHelper {
  async generatePasswordResetToken(email: string): Promise<string> {
    const user = await AppDataSource.createQueryBuilder(User, "user").where("email = :email", { email }).getOne();
    if (!user) throw new ApiError("user-not-found", "Usuário não existente", 400, true);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return token;
  }

  async sendPasswordResetTokenEmail(to: string, customerName: string, token: string) {
    const msg = {
      to: to,
      from: `Suporte <${process.env.MAIL_FROM}>`,
      templateId: "d-1cb3f7def83747d7974b7e6e4ed1699b",
      dynamicTemplateData: {
        subject: "Seu link de recuperação de senha",
        customer_name: customerName,
        password_reset_url: `${process.env.FRONTEND_URL}/redefinir_senha?token${token}`,
      },
    };
    await SendGrid.send(msg);
  }
}

export default new AuthenticationHelper();
