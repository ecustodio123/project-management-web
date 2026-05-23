import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import { Box, Chip, Grid, Paper, Stack, Typography } from '@mui/material'
import { Link } from 'react-router'
import { EmptyState } from '../../components/EmptyState'
import type { Project } from '../../types/project'
import { paths } from '../../routes/paths'

type ProjectListProps = {
  projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return <EmptyState title="Sin proyectos todavía" message="Crea tu primer proyecto para organizar tareas, clientes y actividad." />
  }

  return (
    <Grid container spacing={2.5}>
      {projects.map((project) => (
        <Grid key={project.id} size={{ xs: 12, md: 6, lg: 4 }}>
          <Paper
            component={Link}
            to={paths.projectDetail(project.id)}
            variant="outlined"
            sx={{
              display: 'block',
              height: '100%',
              p: 2.5,
              borderRadius: 3,
              bgcolor: 'common.white',
              transition: 'border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease',
              '&:hover': {
                borderColor: 'primary.main',
                transform: 'translateY(-2px)',
                boxShadow: '0 18px 36px rgba(15, 23, 42, 0.10)',
              },
            }}
          >
            <Stack spacing={2.5} sx={{ height: '100%' }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: '#eff6ff',
                    color: 'primary.main',
                  }}
                >
                  <FolderOutlinedIcon />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                    {project.name}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Owner workspace
                  </Typography>
                </Box>
              </Stack>

              <Typography color="text.secondary" sx={{ minHeight: 50 }}>
                {project.description || 'Sin descripción'}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  icon={<TaskAltOutlinedIcon />}
                  label={`${project.tasks?.length ?? 0} tareas`}
                  size="small"
                  sx={{ bgcolor: '#f8fafc' }}
                />
                <Chip
                  icon={<CalendarTodayOutlinedIcon />}
                  label={formatDate(project.createdAt)}
                  size="small"
                  sx={{ bgcolor: '#f8fafc' }}
                />
              </Stack>

              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                <Typography color="primary" sx={{ fontWeight: 800 }} variant="body2">
                  Abrir proyecto
                </Typography>
                <ArrowForwardIcon color="primary" fontSize="small" />
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}

function formatDate(value?: string) {
  if (!value) return 'Sin fecha'

  return new Intl.DateTimeFormat('es', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}
