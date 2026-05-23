import { Chip, List, ListItem, ListItemText, Paper, Stack, Typography } from '@mui/material'
import { EmptyState } from '../../components/EmptyState'
import type { Task } from '../../types/task'

type TaskListProps = {
  tasks: Task[]
}

const statusLabel: Record<Task['status'], string> = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  REVIEW: 'Review',
  DONE: 'Done',
}

const priorityLabel: Record<Task['priority'], string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
}

export function TaskList({ tasks }: TaskListProps) {
  console.log({tasks})
  if (tasks.length === 0) {
    return <EmptyState title="No tasks yet" message="Add a task to track work for this project." />
  }

  return (
    <Paper variant="outlined">
      <List disablePadding>
        {tasks.map((task) => (
          <ListItem key={task.id} divider>
            <ListItemText
              primary={
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 600 }}>{task.title}</Typography>
                  <Chip label={statusLabel[task.status]} size="small" />
                  <Chip label={priorityLabel[task.priority]} size="small" variant="outlined" />
                </Stack>
              }
              secondary={task.description || 'No description'}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}
