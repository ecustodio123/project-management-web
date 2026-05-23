import { zodResolver } from '@hookform/resolvers/zod'
import AddTaskIcon from '@mui/icons-material/AddTask'
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined'
import TitleOutlinedIcon from '@mui/icons-material/TitleOutlined'
import { Button, InputAdornment, MenuItem, Stack, TextField } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useNotification } from '../../providers/notificationContext'
import type { TaskPriority } from '../../types/task'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { taskKeys } from './taskKeys'
import { createTask } from './tasksApi'

const schema = z.object({
  title: z.string().min(2, 'Task title must be at least 2 characters'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
})

type TaskFormValues = z.infer<typeof schema>

type TaskCreateFormProps = {
  projectId: string
}

export function TaskCreateForm({ projectId }: TaskCreateFormProps) {
  const queryClient = useQueryClient()
  const { notify } = useNotification()
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'MEDIUM',
    },
  })

  const mutation = useMutation({
    mutationFn: (values: TaskFormValues) => createTask(projectId, values),
    onSuccess: () => {
      form.reset({ title: '', description: '', priority: 'MEDIUM' })
      queryClient.invalidateQueries({ queryKey: taskKeys.byProject(projectId) })
      notify('Tarea creada correctamente.')
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
        label="Task title"
        size="small"
        fullWidth
        error={Boolean(form.formState.errors.title)}
        helperText={form.formState.errors.title?.message}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <TitleOutlinedIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        {...form.register('title')}
      />
      <TextField
        label="Description"
        size="small"
        fullWidth
        error={Boolean(form.formState.errors.description)}
        helperText={form.formState.errors.description?.message}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <NotesOutlinedIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        {...form.register('description')}
      />
      <TextField select label="Priority" size="small" sx={{ minWidth: 160 }} {...form.register('priority')}>
        {taskPriorityOptions.map((priority) => (
          <MenuItem key={priority.value} value={priority.value}>
            {priority.label}
          </MenuItem>
        ))}
      </TextField>
      <Button
        type="submit"
        variant="contained"
        startIcon={<AddTaskIcon />}
        disabled={mutation.isPending}
        sx={{ minWidth: 130, textTransform: 'none', fontWeight: 800 }}
      >
        {mutation.isPending ? 'Adding...' : 'Add task'}
      </Button>
    </Stack>
  )
}

const taskPriorityOptions: Array<{ value: TaskPriority; label: string }> = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
]
