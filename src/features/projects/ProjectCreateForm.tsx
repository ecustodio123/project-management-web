import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Stack, TextField } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { projectKeys } from './projectKeys'
import { createProject } from './projectsApi'

const schema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  description: z.string().optional(),
})

type ProjectFormValues = z.infer<typeof schema>

export function ProjectCreateForm() {
  const queryClient = useQueryClient()
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
    },
  })

  return (
    <Stack
      component="form"
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
    >
      <TextField
        label="Project name"
        size="small"
        sx={{ minWidth: 240 }}
        error={Boolean(form.formState.errors.name)}
        helperText={form.formState.errors.name?.message}
        {...form.register('name')}
      />
      <TextField
        label="Description"
        size="small"
        fullWidth
        error={Boolean(form.formState.errors.description)}
        helperText={form.formState.errors.description?.message}
        {...form.register('description')}
      />
      <Button type="submit" variant="contained" disabled={mutation.isPending} sx={{ minWidth: 140 }}>
        {mutation.isPending ? 'Creating...' : 'New project'}
      </Button>
    </Stack>
  )
}
