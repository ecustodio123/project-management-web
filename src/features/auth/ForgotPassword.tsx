import { zodResolver } from "@hookform/resolvers/zod";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import {
  Alert,
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { resetPassword } from "aws-amplify/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { paths } from "../../routes/paths";
import { getErrorMessage } from "../../utils/getErrorMessage";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type ForgotPasswordValues = z.infer<typeof schema>;

export function ForgotPassword() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<unknown>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = form.handleSubmit(async ({ email }) => {
    try {
      setSubmitError(null);
      setIsSubmitting(true);

      await resetPassword({ username: email });

      navigate(paths.resetPassword, {
        state: { email },
      });
    } catch (error) {
      setSubmitError(error);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Stack
      component="form"
      spacing={3}
      onSubmit={handleSubmit}
      sx={{ width: "100%", maxWidth: 420, mx: "auto" }}
    >
      <Stack spacing={1}>
        <Typography color="primary" sx={{ fontWeight: 800 }} variant="body2">
          Recupera tu acceso
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
          Olvidé mi contraseña
        </Typography>
        <Typography color="text.secondary">
          Ingresa tu correo y te enviaremos un código para crear una nueva
          contraseña.
        </Typography>
      </Stack>

      {submitError ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {getErrorMessage(submitError)}
        </Alert>
      ) : null}

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
          {isSubmitting ? "Enviando código..." : "Enviar código"}
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
            ¿Recordaste tu contraseña?{" "}
            <Typography
              component={Link}
              to={paths.login}
              color="primary"
              sx={{ fontWeight: 800 }}
            >
              Iniciar sesión
            </Typography>
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
