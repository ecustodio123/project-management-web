import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import { Box, Chip, List, ListItem, ListItemText, Paper, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { EmptyState } from '../../components/EmptyState'
import { paths } from '../../routes/paths'
import type { Task } from '../../types/task'

type TaskListData = Task[] | {
  tasks?: Task[]
  items?: Task[]
}

type TaskListProps = {
  tasks: TaskListData
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
  const taskItems = Array.isArray(tasks) ? tasks : tasks.tasks ?? tasks.items ?? []

  if (taskItems.length === 0) {
    return <EmptyState title="Sin tareas todavía" message="Agrega una tarea para empezar a dar seguimiento al proyecto." />
  }

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: 'common.white' }}>
      <List disablePadding>
        {taskItems.map((task) => (
          <ListItem
            key={task.id}
            component={Link}
            to={paths.taskDetail(task.projectId, task.id)}
            divider
            sx={{
              alignItems: 'flex-start',
              color: 'inherit',
              cursor: 'pointer',
              px: 2.5,
              py: 2,
              '&:hover': { bgcolor: '#f8fafc' },
            }}
          >
            <ListItemText
              primary={
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography sx={{ fontWeight: 800 }}>{task.title}</Typography>
                    <Chip label={statusLabel[task.status]} size="small" sx={{ bgcolor: statusColor[task.status] }} />
                    <Chip label={priorityLabel[task.priority]} size="small" variant="outlined" />
                  </Stack>
                  <Typography color="text.secondary" variant="body2">
                    {task.description || 'Sin descripción'}
                  </Typography>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                    <MetaItem icon={<PersonOutlineOutlinedIcon fontSize="small" />} text={task.assignee?.name || 'Sin asignar'} />
                    <MetaItem icon={<CalendarTodayOutlinedIcon fontSize="small" />} text={formatDate(task.dueDate)} />
                  </Stack>
                </Stack>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

const statusColor: Record<Task['status'], string> = {
  TODO: '#eff6ff',
  IN_PROGRESS: '#fef3c7',
  REVIEW: '#f5f3ff',
  DONE: '#dcfce7',
}

type MetaItemProps = {
  icon: ReactNode
  text: string
}

function MetaItem({ icon, text }: MetaItemProps) {
  return (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', color: 'text.secondary' }}>
      <Box sx={{ display: 'grid', placeItems: 'center' }}>{icon}</Box>
      <Typography variant="caption">{text}</Typography>
    </Stack>
  )
}

function formatDate(value?: string | null) {
  if (!value) return 'Sin fecha'

  return new Intl.DateTimeFormat('es', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}
