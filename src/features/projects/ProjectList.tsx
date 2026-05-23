import { Grid, Paper, Stack, Typography } from '@mui/material'
import { Link } from 'react-router'
import { EmptyState } from '../../components/EmptyState'
import type { Project } from '../../types/project'
import { paths } from '../../routes/paths'

type ProjectListProps = {
  projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return <EmptyState title="No projects yet" message="Create your first project to start organizing tasks and client work." />
  }

  return (
    <Grid container spacing={2}>
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
              transition: 'border-color 120ms ease',
              '&:hover': { borderColor: 'primary.main' },
            }}
          >
              <Stack spacing={1}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6">{project.name}</Typography>
                </Stack>
                <Typography color="text.secondary" sx={{ minHeight: 48 }}>
                  {project.description || 'No description'}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}
