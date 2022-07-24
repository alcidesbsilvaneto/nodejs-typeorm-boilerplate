import { Router } from "express";
import AuthenticationHandler from "./Authentication.handler";
import AuthenticationValidator from "./Authentication.validator";

export default (): Router => {
  const routes = Router();

  routes.post(`/`, AuthenticationValidator.validateLoginRequest(), AuthenticationHandler.handleAuthenticate);
  routes.post(`/request_password_reset_token`, AuthenticationValidator.validatePasswordResetTokenRequest(), AuthenticationHandler.handleRequestPasswordResetToken);
  routes.post(`/reset_password`, AuthenticationValidator.validatePasswordResetRequest(), AuthenticationHandler.handleResetPassword);
  return routes;
};
