import { zodResolver } from '@hookform/resolvers/zod'
import { Button, MenuItem, Stack, TextField } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { taskKeys } from './taskKeys'
import { createTask } from './tasksApi'

const schema = z.object({
  title: z.string().min(2, 'Task title must be at least 2 characters'),
  status: z.enum(['todo', 'in_progress', 'done']),
})

type TaskFormValues = z.infer<typeof schema>

type TaskCreateFormProps = {
  projectId: string
}

export function TaskCreateForm({ projectId }: TaskCreateFormProps) {
  const queryClient = useQueryClient()
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      status: 'todo',
    },
  })

  const mutation = useMutation({
    mutationFn: (values: TaskFormValues) => createTask(projectId, values),
    onSuccess: () => {
      form.reset({ title: '', status: 'todo' })
      queryClient.invalidateQueries({ queryKey: taskKeys.byProject(projectId) })
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
        label="Task title"
        size="small"
        fullWidth
        error={Boolean(form.formState.errors.title)}
        helperText={form.formState.errors.title?.message}
        {...form.register('title')}
      />
      <TextField select label="Status" size="small" sx={{ minWidth: 180 }} {...form.register('status')}>
        <MenuItem value="todo">To do</MenuItem>
        <MenuItem value="in_progress">In progress</MenuItem>
        <MenuItem value="done">Done</MenuItem>
      </TextField>
      <Button type="submit" variant="contained" disabled={mutation.isPending} sx={{ minWidth: 120 }}>
        {mutation.isPending ? 'Adding...' : 'Add task'}
      </Button>
    </Stack>
  )
}
