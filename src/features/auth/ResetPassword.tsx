import { zodResolver } from "@hookform/resolvers/zod";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { confirmResetPassword } from "aws-amplify/auth";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { z } from "zod";
import { paths } from "../../routes/paths";
import { getErrorMessage } from "../../utils/getErrorMessage";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  confirmationCode: z.string().min(1, "Confirmation code is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type ResetPasswordValues = z.infer<typeof schema>;

export function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<unknown>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const emailFromState =
    (location.state as { email?: string } | null)?.email ?? "";

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: emailFromState,
      confirmationCode: "",
      password: "",
    },
  });

  const passwordValue =
    useWatch({ control: form.control, name: "password" }) ?? "";
  const passwordStrength = useMemo(() => {
    let score = 0;

    if (passwordValue.length >= 8) score += 35;
    if (/[A-Z]/.test(passwordValue)) score += 20;
    if (/[0-9]/.test(passwordValue)) score += 20;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score += 25;

    return Math.min(score, 100);
  }, [passwordValue]);

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      setSubmitError(null);
      setIsSubmitting(true);

      await confirmResetPassword({
        username: values.email,
        confirmationCode: values.confirmationCode,
        newPassword: values.password,
      });

      setIsComplete(true);
    } catch (error) {
      setSubmitError(error);
    } finally {
      setIsSubmitting(false);
    }
  });

  if (isComplete) {
    return (
      <Stack spacing={3} sx={{ width: "100%", maxWidth: 420, mx: "auto" }}>
        <Stack spacing={1}>
          <Typography color="primary" sx={{ fontWeight: 800 }} variant="body2">
            Contraseña actualizada
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
            Ya puedes iniciar sesión
          </Typography>
          <Typography color="text.secondary">
            Tu nueva contraseña quedó registrada correctamente.
          </Typography>
        </Stack>

        <Alert severity="success" sx={{ borderRadius: 2 }}>
          Usa tu nueva contraseña para entrar a tu workspace.
        </Alert>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate(paths.login, { replace: true })}
          sx={{
            py: 1.35,
            fontWeight: 800,
            textTransform: "none",
            boxShadow: "0 12px 24px rgba(37, 99, 235, 0.24)",
          }}
        >
          Ir al login
        </Button>
      </Stack>
    );
  }

  return (
    <Stack
      component="form"
      spacing={3}
      onSubmit={handleSubmit}
      sx={{ width: "100%", maxWidth: 420, mx: "auto" }}
    >
      <Stack spacing={1}>
        <Typography color="primary" sx={{ fontWeight: 800 }} variant="body2">
          Código de verificación
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
          Restablece tu contraseña
        </Typography>
        <Typography color="text.secondary">
          Ingresa el código enviado por Cognito y define una nueva contraseña.
        </Typography>
      </Stack>

      {submitError ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {getErrorMessage(submitError)}
        </Alert>
      ) : null}

      <Stack spacing={2}>
        <TextField
          label="Correo"
          type="email"
          autoComplete="email"
          fullWidth
          error={Boolean(form.formState.errors.email)}
          helperText={form.formState.errors.email?.message}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          {...form.register("email")}
        />

        <TextField
          label="Código"
          autoComplete="one-time-code"
          fullWidth
          error={Boolean(form.formState.errors.confirmationCode)}
          helperText={form.formState.errors.confirmationCode?.message}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <MarkEmailReadOutlinedIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          {...form.register("confirmationCode")}
        />

        <TextField
          label="Nueva contraseña"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          fullWidth
          error={Boolean(form.formState.errors.password)}
          helperText={form.formState.errors.password?.message}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    edge="end"
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          {...form.register("password")}
        />

        <Stack spacing={0.75}>
          <LinearProgress
            value={passwordStrength}
            variant="determinate"
            sx={{
              height: 6,
              borderRadius: 999,
              bgcolor: "#e5e7eb",
              "& .MuiLinearProgress-bar": {
                bgcolor:
                  passwordStrength > 75
                    ? "success.main"
                    : passwordStrength > 45
                      ? "warning.main"
                      : "error.main",
              },
            }}
          />
          <Typography color="text.secondary" variant="caption">
            Usa al menos 8 caracteres. Mayúsculas, números o símbolos ayudan a
            fortalecerla.
          </Typography>
        </Stack>
      </Stack>

      <Stack spacing={2}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{
            py: 1.35,
            fontWeight: 800,
            textTransform: "none",
            boxShadow: "0 12px 24px rgba(37, 99, 235, 0.24)",
          }}
        >
          {isSubmitting ? "Actualizando..." : "Actualizar contraseña"}
        </Button>

        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            px: 2,
            py: 1.5,
            textAlign: "center",
            bgcolor: "#f8fafc",
          }}
        >
          <Typography color="text.secondary" variant="body2">
            ¿Necesitas otro código?{" "}
            <Typography
              component={Link}
              to={paths.forgotPassword}
              color="primary"
              sx={{ fontWeight: 800 }}
            >
              Solicitar código
            </Typography>
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
