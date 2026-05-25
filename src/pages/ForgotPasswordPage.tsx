import { ForgotPassword } from "../features/auth/ForgotPassword";
import { usePageTitle } from "../hooks/usePageTitle";

export function ForgotPasswordPage() {
  usePageTitle("Forgot Password");
  return <ForgotPassword />;
}
