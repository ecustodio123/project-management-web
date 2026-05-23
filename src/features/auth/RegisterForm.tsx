import { zodResolver } from '@hookform/resolvers/zod'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
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
} from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'
import { useAuth } from '../../auth/authContext'
import { paths } from '../../routes/paths'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { register as registerUser } from './authApi'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type RegisterFormValues = z.infer<typeof schema>

export function RegisterForm() {
  const navigate = useNavigate()
  const { setSession } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })
  const passwordValue = useWatch({ control: form.control, name: 'password' }) ?? ''
  const passwordStrength = useMemo(() => {
    let score = 0

    if (passwordValue.length >= 8) score += 35
    if (/[A-Z]/.test(passwordValue)) score += 20
    if (/[0-9]/.test(passwordValue)) score += 20
    if (/[^A-Za-z0-9]/.test(passwordValue)) score += 25

    return Math.min(score, 100)
  }, [passwordValue])

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: async (data) => {
      await setSession(data)
      navigate(paths.projects, { replace: true })
    },
  })

  return (
    <Stack
      component="form"
      spacing={3}
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      sx={{ width: '100%', maxWidth: 420, mx: 'auto' }}
    >
      <Stack spacing={1}>
        <Typography color="primary" sx={{ fontWeight: 800, letterSpacing: 0 }} variant="body2">
          Empieza a organizar tu trabajo
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
          Crea tu cuenta
        </Typography>
        <Typography color="text.secondary">
          Configura tu acceso para gestionar proyectos, tareas y clientes.
        </Typography>
      </Stack>

      {mutation.isError ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {getErrorMessage(mutation.error)}
        </Alert>
      ) : null}

      <Stack spacing={2}>
        <TextField
          label="Nombre"
          autoComplete="name"
          fullWidth
          error={Boolean(form.formState.errors.name)}
          helperText={form.formState.errors.name?.message}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineOutlinedIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          {...form.register('name')}
        />
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
          {...form.register('email')}
        />
        <TextField
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
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
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    edge="end"
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          {...form.register('password')}
        />
        <Stack spacing={0.75}>
          <LinearProgress
            value={passwordStrength}
            variant="determinate"
            sx={{
              height: 6,
              borderRadius: 999,
              bgcolor: '#e5e7eb',
              '& .MuiLinearProgress-bar': {
                bgcolor: passwordStrength > 75 ? 'success.main' : passwordStrength > 45 ? 'warning.main' : 'error.main',
              },
            }}
          />
          <Typography color="text.secondary" variant="caption">
            Usa al menos 8 caracteres. Mayúsculas, números o símbolos ayudan a fortalecerla.
          </Typography>
        </Stack>
      </Stack>

      <Stack spacing={2}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={mutation.isPending}
          sx={{
            py: 1.35,
            fontWeight: 800,
            textTransform: 'none',
            boxShadow: '0 12px 24px rgba(37, 99, 235, 0.24)',
          }}
        >
          {mutation.isPending ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            px: 2,
            py: 1.5,
            textAlign: 'center',
            bgcolor: '#f8fafc',
          }}
        >
          <Typography color="text.secondary" variant="body2">
            ¿Ya tienes cuenta?{' '}
            <Typography component={Link} to={paths.login} color="primary" sx={{ fontWeight: 800 }}>
              Iniciar sesión
            </Typography>
          </Typography>
        </Box>
      </Stack>
    </Stack>
  )
}
