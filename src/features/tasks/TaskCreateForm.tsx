import { zodResolver } from '@hookform/resolvers/zod'
import { Button, MenuItem, Stack, TextField } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { TaskPriority, TaskStatus } from '../../types/task'
import { taskKeys } from './taskKeys'
import { createTask } from './tasksApi'

const schema = z.object({
  title: z.string().min(2, 'Task title must be at least 2 characters'),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
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
      status: 'TODO',
      priority: 'MEDIUM',
    },
  })

  const mutation = useMutation({
    mutationFn: (values: TaskFormValues) => createTask(projectId, values),
    onSuccess: () => {
      form.reset({ title: '', status: 'TODO', priority: 'MEDIUM' })
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
        {taskStatusOptions.map((status) => (
          <MenuItem key={status.value} value={status.value}>
            {status.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField select label="Priority" size="small" sx={{ minWidth: 160 }} {...form.register('priority')}>
        {taskPriorityOptions.map((priority) => (
          <MenuItem key={priority.value} value={priority.value}>
            {priority.label}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit" variant="contained" disabled={mutation.isPending} sx={{ minWidth: 120 }}>
        {mutation.isPending ? 'Adding...' : 'Add task'}
      </Button>
    </Stack>
  )
}

const taskStatusOptions: Array<{ value: TaskStatus; label: string }> = [
  { value: 'TODO', label: 'To do' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'REVIEW', label: 'Review' },
  { value: 'DONE', label: 'Done' },
]

const taskPriorityOptions: Array<{ value: TaskPriority; label: string }> = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
]
