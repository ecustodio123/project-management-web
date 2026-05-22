import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Stack, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { z } from 'zod'
import { useAuth } from '../../auth/authContext'
import { paths } from '../../routes/paths'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { login } from './authApi'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof schema>

export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setSession } = useAuth()
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? paths.projects

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setSession(data)
      navigate(from, { replace: true })
    },
  })

  return (
    <Stack component="form" spacing={2.5} onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
      <div>
        <Typography variant="h5">Log in</Typography>
        <Typography color="text.secondary">Use your portal account.</Typography>
      </div>

      {mutation.isError ? <Alert severity="error">{getErrorMessage(mutation.error)}</Alert> : null}

      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        fullWidth
        error={Boolean(form.formState.errors.email)}
        helperText={form.formState.errors.email?.message}
        {...form.register('email')}
      />
      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        fullWidth
        error={Boolean(form.formState.errors.password)}
        helperText={form.formState.errors.password?.message}
        {...form.register('password')}
      />
      <Button type="submit" variant="contained" size="large" disabled={mutation.isPending}>
        {mutation.isPending ? 'Logging in...' : 'Log in'}
      </Button>
      <Typography color="text.secondary" variant="body2">
        Need an account? <Link to={paths.register}>Register</Link>
      </Typography>
    </Stack>
  )
}
