import { Alert, Paper, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
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

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Projects</Typography>
        <Typography color="text.secondary">Manage client work, tasks, and project activity.</Typography>
      </div>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <ProjectCreateForm />
      </Paper>

      {projectsQuery.isLoading ? <LoadingState /> : null}
      {projectsQuery.isError ? <Alert severity="error">{getErrorMessage(projectsQuery.error)}</Alert> : null}
      {projectsQuery.data ? <ProjectList projects={projectsQuery.data} /> : null}
    </Stack>
  )
}
