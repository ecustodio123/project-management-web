import { ResetPassword } from "../features/auth/ResetPassword";
import { usePageTitle } from "../hooks/usePageTitle";

export function ResetPasswordPage() {
  usePageTitle("Reset Password");
  return <ResetPassword />;
}
