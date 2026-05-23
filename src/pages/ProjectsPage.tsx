import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Alert, Box, Grid, Paper, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { LoadingState } from '../components/LoadingState'
import { ProjectCreateForm } from '../features/projects/ProjectCreateForm'
import { ProjectList } from '../features/projects/ProjectList'
import { projectKeys } from '../features/projects/projectKeys'
import { getProjects } from '../features/projects/projectsApi'
import { usePageTitle } from '../hooks/usePageTitle'
import { getErrorMessage } from '../utils/getErrorMessage'

export function ProjectsPage() {
  usePageTitle('Projects')

  const projectsQuery = useQuery({
    queryKey: projectKeys.all,
    queryFn: getProjects,
  })
  const projects = projectsQuery.data ?? []
  const totalTasks = projects.reduce((count, project) => count + (project.tasks?.length ?? 0), 0)

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
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: '#93c5fd', fontWeight: 800, mb: 1 }} variant="body2">
              Dashboard
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.08, maxWidth: 680 }}>
              Proyectos, tareas y clientes en un solo tablero.
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.72)', mt: 2, maxWidth: 720 }}>
              Gestiona entregables, revisa avances y mantén la operación diaria organizada sin perder visibilidad.
            </Typography>
          </Box>

          <Grid container spacing={1.5} sx={{ width: { xs: '100%', md: 380 } }}>
            <MetricCard icon={<FolderOutlinedIcon />} label="Proyectos" value={projects.length} />
            <MetricCard icon={<AssignmentTurnedInIcon />} label="Tareas" value={totalTasks} />
          </Grid>
        </Stack>
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          borderRadius: 3,
          bgcolor: 'common.white',
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)',
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                bgcolor: '#eff6ff',
                color: 'primary.main',
              }}
            >
              <TrendingUpIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h6">Nuevo proyecto</Typography>
              <Typography color="text.secondary" variant="body2">
                Crea un espacio para organizar tareas, miembros y actividad.
              </Typography>
            </Box>
          </Stack>
          <ProjectCreateForm />
        </Stack>
      </Paper>

      {projectsQuery.isLoading ? <LoadingState /> : null}
      {projectsQuery.isError ? <Alert severity="error">{getErrorMessage(projectsQuery.error)}</Alert> : null}
      {projectsQuery.data ? <ProjectList projects={projectsQuery.data} /> : null}
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
    <Grid size={{ xs: 6 }}>
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
