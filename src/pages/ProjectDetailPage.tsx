import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import GroupsIcon from '@mui/icons-material/Groups'
import HistoryIcon from '@mui/icons-material/History'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import { Alert, Box, Button, Chip, Divider, Grid, Paper, Stack, Tab, Tabs, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { Link, useNavigate, useParams } from 'react-router'
import { LoadingState } from '../components/LoadingState'
import { TaskCreateForm } from '../features/tasks/TaskCreateForm'
import { TaskDetailModal } from '../features/tasks/TaskDetailModal'
import { TaskList } from '../features/tasks/TaskList'
import { taskKeys } from '../features/tasks/taskKeys'
import { getProjectTasks } from '../features/tasks/tasksApi'
import { ProjectMembersPanel } from '../features/projects/ProjectMembersPanel'
import { projectKeys } from '../features/projects/projectKeys'
import { getProject, getProjectActivity, getProjectMembers } from '../features/projects/projectsApi'
import { usePageTitle } from '../hooks/usePageTitle'
import { paths } from '../routes/paths'
import { getErrorMessage } from '../utils/getErrorMessage'

export function ProjectDetailPage() {
  const { projectId = '', taskId } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)

  const projectQuery = useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => getProject(projectId),
    enabled: Boolean(projectId),
  })

  const tasksQuery = useQuery({
    queryKey: taskKeys.byProject(projectId),
    queryFn: () => getProjectTasks(projectId),
    enabled: Boolean(projectId),
  })

  const membersQuery = useQuery({
    queryKey: projectKeys.members(projectId),
    queryFn: () => getProjectMembers(projectId),
    enabled: Boolean(projectId) && tab === 1,
  })

  const activityQuery = useQuery({
    queryKey: projectKeys.activity(projectId),
    queryFn: () => getProjectActivity(projectId),
    enabled: Boolean(projectId) && tab === 2,
  })

  usePageTitle(projectQuery.data?.name ?? 'Project')
  const tasks = tasksQuery.data ?? []
  const members = membersQuery.data ?? []
  const activity = activityQuery.data ?? []

  if (projectQuery.isLoading) {
    return <LoadingState />
  }

  if (projectQuery.isError) {
    return <Alert severity="error">{getErrorMessage(projectQuery.error)}</Alert>
  }

  if (!projectQuery.data) {
    return <Alert severity="warning">Project not found.</Alert>
  }

  return (
    <Stack spacing={3.5}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          color: 'common.white',
          bgcolor: '#172033',
          backgroundImage: 'linear-gradient(135deg, #172033 0%, #1d3b76 100%)',
          overflow: 'hidden',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            right: -80,
            bottom: -120,
            width: 300,
            height: 300,
            borderRadius: '50%',
            bgcolor: 'rgba(37, 99, 235, 0.34)',
          },
        }}
      >
        <Stack spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
          <Button
            component={Link}
            to={paths.projects}
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            sx={{
              alignSelf: 'flex-start',
              color: 'common.white',
              borderColor: 'rgba(255,255,255,0.32)',
              textTransform: 'none',
              fontWeight: 800,
              '&:hover': { borderColor: 'common.white', bgcolor: 'rgba(255,255,255,0.08)' },
            }}
          >
            Volver a proyectos
          </Button>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', mb: 1.5 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'primary.main',
                    color: 'common.white',
                  }}
                >
                  <WorkOutlineOutlinedIcon />
                </Box>
                <Chip label="Proyecto activo" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'common.white' }} />
              </Stack>
              <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.08, maxWidth: 760 }}>
                {projectQuery.data.name}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.72)', mt: 2, maxWidth: 760 }}>
                {projectQuery.data.description || 'Sin descripción'}
              </Typography>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mt: 2, color: 'rgba(255,255,255,0.72)' }}>
                <CalendarTodayOutlinedIcon fontSize="small" />
                <Typography variant="body2">Creado {formatDate(projectQuery.data.createdAt)}</Typography>
              </Stack>
            </Box>

            <Grid container spacing={1.5} sx={{ width: { xs: '100%', md: 440 } }}>
              <MetricCard icon={<AssignmentTurnedInIcon />} label="Tareas" value={tasks.length} />
              <MetricCard icon={<GroupsIcon />} label="Miembros" value={members.length} />
              <MetricCard icon={<HistoryIcon />} label="Actividad" value={activity.length} />
            </Grid>
          </Stack>
        </Stack>
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'common.white',
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)',
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, nextTab) => setTab(nextTab)}
          sx={{
            px: 2,
            minHeight: 62,
            '& .MuiTab-root': { minHeight: 62, textTransform: 'none', fontWeight: 800 },
          }}
        >
          <Tab icon={<AssignmentTurnedInIcon fontSize="small" />} iconPosition="start" label="Tareas" />
          <Tab icon={<GroupsIcon fontSize="small" />} iconPosition="start" label="Miembros" />
          <Tab icon={<HistoryIcon fontSize="small" />} iconPosition="start" label="Actividad" />
        </Tabs>
        <Divider />
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {tab === 0 ? (
            <Stack spacing={2.5}>
              <SectionHeader
                title="Tareas del proyecto"
                description="Crea y revisa el trabajo pendiente, prioridades y responsables."
              />
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc' }}>
                <TaskCreateForm projectId={projectId} />
              </Paper>
              {tasksQuery.isLoading ? <LoadingState /> : null}
              {tasksQuery.isError ? <Alert severity="error">{getErrorMessage(tasksQuery.error)}</Alert> : null}
              {tasksQuery.data ? <TaskList tasks={tasksQuery.data} /> : null}
            </Stack>
          ) : null}

          {tab === 1 ? (
            <ProjectMembersPanel
              projectId={projectId}
              members={members}
              isLoading={membersQuery.isLoading}
              error={membersQuery.error}
            />
          ) : null}

          {tab === 2 ? (
            <Stack spacing={2.5}>
              <SectionHeader title="Actividad" description="Historial de cambios y eventos recientes del proyecto." />
              {activityQuery.isLoading ? <LoadingState /> : null}
              {activityQuery.isError ? <Alert severity="error">{getErrorMessage(activityQuery.error)}</Alert> : null}
              {!activityQuery.isLoading && activity.length === 0 ? (
                <EmptyState title="Sin actividad" message="Los cambios relevantes aparecerán en este historial." />
              ) : null}
              <Stack spacing={1.5}>
                {activity.map((item) => (
                  <Paper key={item.id} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 2,
                          display: 'grid',
                          placeItems: 'center',
                          bgcolor: '#eff6ff',
                          color: 'primary.main',
                          flex: '0 0 auto',
                        }}
                      >
                        <HistoryIcon fontSize="small" />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>{item.message}</Typography>
                        <Typography color="text.secondary" variant="body2">
                          {item.user?.name || 'Sistema'} · {formatDateTime(item.createdAt)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Stack>
          ) : null}
        </Box>
      </Paper>
      {taskId ? (
        <TaskDetailModal
          open={Boolean(taskId)}
          taskId={taskId}
          projectId={projectId}
          onClose={() => navigate(paths.projectDetail(projectId))}
        />
      ) : null}
    </Stack>
  )
}

type MetricCardProps = {
  icon: ReactNode
  label: string
  value: number
}

function MetricCard({ icon, label, value }: MetricCardProps) {
  return (
    <Grid size={{ xs: 4 }}>
      <Box
        sx={{
          p: 2,
          height: '100%',
          borderRadius: 2,
          bgcolor: 'rgba(255,255,255,0.10)',
          border: '1px solid rgba(255,255,255,0.14)',
        }}
      >
        <Box sx={{ color: '#93c5fd', mb: 1 }}>{icon}</Box>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {value}
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.70)' }} variant="body2">
          {label}
        </Typography>
      </Box>
    </Grid>
  )
}

type SectionHeaderProps = {
  title: string
  description: string
}

function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      <Typography color="text.secondary">{description}</Typography>
    </Box>
  )
}

function formatDate(value?: string) {
  if (!value) return 'sin fecha'

  return new Intl.DateTimeFormat('es', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function formatDateTime(value?: string) {
  if (!value) return 'sin fecha'

  return new Intl.DateTimeFormat('es', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}
