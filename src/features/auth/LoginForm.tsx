import { zodResolver } from "@hookform/resolvers/zod";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { z } from "zod";
import { paths } from "../../routes/paths";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { login } from "./authApi";
import { signIn } from "aws-amplify/auth";
import { useAuth } from "../../auth/authContext";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof schema>;

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession, completeCognitoLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? paths.projects;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleCognitoLogin = form.handleSubmit(async (values) => {
    try {
      await signIn({
        username: values.email,
        password: values.password,
      });

      await completeCognitoLogin();

      navigate(from, { replace: true });
    } catch (error) {
      console.error("COGNITO LOGIN ERROR", error);
    }
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      await setSession(data);
      navigate(from, { replace: true });
    },
  });

  return (
    <Stack
      component="form"
      spacing={3}
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      sx={{ width: "100%", maxWidth: 420, mx: "auto" }}
    >
      <Stack spacing={1}>
        <Typography
          color="primary"
          sx={{ fontWeight: 800, letterSpacing: 0 }}
          variant="body2"
        >
          Bienvenido de vuelta
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
          Inicia sesión
        </Typography>
        <Typography color="text.secondary">
          Accede a tus proyectos, tareas y conversaciones con clientes.
        </Typography>
      </Stack>

      {mutation.isError ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {getErrorMessage(mutation.error)}
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
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
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
      </Stack>

      <Stack spacing={2}>
        <Button
          type="button"
          variant="contained"
          size="large"
          disabled={mutation.isPending}
          onClick={handleCognitoLogin}
          sx={{
            py: 1.35,
            fontWeight: 800,
            textTransform: "none",
            boxShadow: "0 12px 24px rgba(37, 99, 235, 0.24)",
          }}
        >
          {mutation.isPending ? "Ingresando..." : "Ingresar"}
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
            ¿No tienes cuenta?{" "}
            <Typography
              component={Link}
              to={paths.register}
              color="primary"
              sx={{ fontWeight: 800 }}
            >
              Crear cuenta
            </Typography>
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
