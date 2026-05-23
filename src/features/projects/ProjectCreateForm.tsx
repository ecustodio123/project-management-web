import { zodResolver } from '@hookform/resolvers/zod'
import AddIcon from '@mui/icons-material/Add'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import { Button, InputAdornment, Stack, TextField } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useNotification } from '../../providers/notificationContext'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { projectKeys } from './projectKeys'
import { createProject } from './projectsApi'

const schema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  description: z.string().optional(),
})

type ProjectFormValues = z.infer<typeof schema>

export function ProjectCreateForm() {
  const queryClient = useQueryClient()
  const { notify } = useNotification()
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      form.reset()
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
      notify('Proyecto creado correctamente.')
    },
    onError: (error) => {
      notify(getErrorMessage(error), 'error')
    },
  })

  return (
    <Stack
      component="form"
      direction={{ xs: 'column', md: 'row' }}
      spacing={1.5}
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
    >
      <TextField
        label="Nombre del proyecto"
        size="small"
        sx={{ minWidth: { xs: '100%', md: 260 } }}
        error={Boolean(form.formState.errors.name)}
        helperText={form.formState.errors.name?.message}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <WorkOutlineOutlinedIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        {...form.register('name')}
      />
      <TextField
        label="Descripción"
        size="small"
        fullWidth
        error={Boolean(form.formState.errors.description)}
        helperText={form.formState.errors.description?.message}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <DescriptionOutlinedIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        {...form.register('description')}
      />
      <Button
        type="submit"
        variant="contained"
        startIcon={<AddIcon />}
        disabled={mutation.isPending}
        sx={{ minWidth: 150, textTransform: 'none', fontWeight: 800 }}
      >
        {mutation.isPending ? 'Creando...' : 'Crear proyecto'}
      </Button>
    </Stack>
  )
}
