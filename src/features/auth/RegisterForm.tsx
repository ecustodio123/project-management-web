import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Stack, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
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

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setSession(data)
      navigate(paths.projects, { replace: true })
    },
  })

  return (
    <Stack component="form" spacing={2.5} onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
      <div>
        <Typography variant="h5">Create account</Typography>
        <Typography color="text.secondary">Start using the portal.</Typography>
      </div>

      {mutation.isError ? <Alert severity="error">{getErrorMessage(mutation.error)}</Alert> : null}

      <TextField
        label="Name"
        autoComplete="name"
        fullWidth
        error={Boolean(form.formState.errors.name)}
        helperText={form.formState.errors.name?.message}
        {...form.register('name')}
      />
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
        autoComplete="new-password"
        fullWidth
        error={Boolean(form.formState.errors.password)}
        helperText={form.formState.errors.password?.message}
        {...form.register('password')}
      />
      <Button type="submit" variant="contained" size="large" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating account...' : 'Create account'}
      </Button>
      <Typography color="text.secondary" variant="body2">
        Already have an account? <Link to={paths.login}>Log in</Link>
      </Typography>
    </Stack>
  )
}
