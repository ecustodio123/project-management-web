import { Alert, Box, Button, Divider, Paper, Stack, Tab, Tabs, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { LoadingState } from '../components/LoadingState'
import { TaskCreateForm } from '../features/tasks/TaskCreateForm'
import { TaskList } from '../features/tasks/TaskList'
import { taskKeys } from '../features/tasks/taskKeys'
import { getProjectTasks } from '../features/tasks/tasksApi'
import { projectKeys } from '../features/projects/projectKeys'
import { getProject, getProjectActivity, getProjectMembers } from '../features/projects/projectsApi'
import { usePageTitle } from '../hooks/usePageTitle'
import { paths } from '../routes/paths'
import { getErrorMessage } from '../utils/getErrorMessage'

export function ProjectDetailPage() {
  const { projectId = '' } = useParams()
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
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between' }}>
        <div>
          <Typography variant="h4">{projectQuery.data.name}</Typography>
          <Typography color="text.secondary">{projectQuery.data.description || 'No description'}</Typography>
        </div>
        <Button component={Link} to={paths.projects} variant="outlined">
          Back to projects
        </Button>
      </Stack>

      <Paper variant="outlined">
        <Tabs value={tab} onChange={(_, nextTab) => setTab(nextTab)} sx={{ px: 2 }}>
          <Tab label="Tasks" />
          <Tab label="Members" />
          <Tab label="Activity" />
        </Tabs>
        <Divider />
        <Box sx={{ p: 2 }}>
          {tab === 0 ? (
            <Stack spacing={2}>
              <TaskCreateForm projectId={projectId} />
              {tasksQuery.isLoading ? <LoadingState /> : null}
              {tasksQuery.isError ? <Alert severity="error">{getErrorMessage(tasksQuery.error)}</Alert> : null}
              {tasksQuery.data ? <TaskList tasks={tasksQuery.data} /> : null}
            </Stack>
          ) : null}

          {tab === 1 ? (
            <Stack spacing={1}>
              {membersQuery.isLoading ? <LoadingState /> : null}
              {membersQuery.isError ? <Alert severity="error">{getErrorMessage(membersQuery.error)}</Alert> : null}
              {membersQuery.data?.map((member) => (
                <Paper key={member.userId} variant="outlined" sx={{ p: 2 }}>
                  <Typography sx={{ fontWeight: 600 }}>{member.name}</Typography>
                  <Typography color="text.secondary">
                    {member.email} · {member.role}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          ) : null}

          {tab === 2 ? (
            <Stack spacing={1}>
              {activityQuery.isLoading ? <LoadingState /> : null}
              {activityQuery.isError ? <Alert severity="error">{getErrorMessage(activityQuery.error)}</Alert> : null}
              {activityQuery.data?.map((item) => (
                <Paper key={item.id} variant="outlined" sx={{ p: 2 }}>
                  <Typography>{item.message}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {item.actorName || 'System'} {item.createdAt ? `· ${new Date(item.createdAt).toLocaleString()}` : ''}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          ) : null}
        </Box>
      </Paper>
    </Stack>
  )
}
