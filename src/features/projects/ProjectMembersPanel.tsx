import { zodResolver } from '@hookform/resolvers/zod'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import GroupsIcon from '@mui/icons-material/Groups'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { EmptyState } from '../../components/EmptyState'
import { LoadingState } from '../../components/LoadingState'
import { useNotification } from '../../providers/notificationContext'
import type { ProjectMember, ProjectRole } from '../../types/project'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { userKeys } from '../users/userKeys'
import { getUsers } from '../users/usersApi'
import { projectKeys } from './projectKeys'
import { addProjectMember, removeProjectMember, updateProjectMember } from './projectsApi'

const schema = z.object({
  userId: z.string().min(1, 'Selecciona un usuario'),
  role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']),
})

type MemberFormValues = z.infer<typeof schema>

type ProjectMembersPanelProps = {
  projectId: string
  members: ProjectMember[]
  isLoading: boolean
  error: unknown
}

const roleOptions: Array<{ value: Exclude<ProjectRole, 'OWNER'>; label: string; description: string }> = [
  { value: 'ADMIN', label: 'Admin', description: 'Puede coordinar tareas y miembros.' },
  { value: 'MEMBER', label: 'Member', description: 'Puede colaborar dentro del proyecto.' },
  { value: 'VIEWER', label: 'Viewer', description: 'Solo necesita visibilidad.' },
]

export function ProjectMembersPanel({ projectId, members, isLoading, error }: ProjectMembersPanelProps) {
  const queryClient = useQueryClient()
  const { notify } = useNotification()
  const usersQuery = useQuery({
    queryKey: userKeys.all,
    queryFn: getUsers,
  })

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      userId: '',
      role: 'MEMBER',
    },
  })

  const mutation = useMutation({
    mutationFn: (values: MemberFormValues) => {
      const selectedUser = usersQuery.data?.find((user) => user.id === values.userId)

      if (!selectedUser) {
        throw new Error('Selecciona un usuario válido')
      }

      return addProjectMember(projectId, {
        email: selectedUser.email,
        role: values.role,
      })
    },
    onSuccess: () => {
      form.reset({ userId: '', role: 'MEMBER' })
      queryClient.invalidateQueries({ queryKey: projectKeys.members(projectId) })
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) })
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
      notify('Miembro agregado correctamente.')
    },
    onError: (error) => {
      notify(getErrorMessage(error), 'error')
    },
  })

  const updateRoleMutation = useMutation({
    mutationFn: (payload: { userId: string; role: ProjectRole }) =>
      updateProjectMember(projectId, payload.userId, { role: payload.role }),
    onSuccess: () => {
      invalidateProjectMembers()
      notify('Rol actualizado.')
    },
    onError: (error) => {
      notify(getErrorMessage(error), 'error')
    },
  })

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => removeProjectMember(projectId, userId),
    onSuccess: () => {
      invalidateProjectMembers()
      notify('Miembro removido.')
    },
    onError: (error) => {
      notify(getErrorMessage(error), 'error')
    },
  })

  const memberUserIds = new Set(members.map((member) => member.userId))
  const availableUsers = (usersQuery.data ?? []).filter((user) => !memberUserIds.has(user.id))

  function invalidateProjectMembers() {
    queryClient.invalidateQueries({ queryKey: projectKeys.members(projectId) })
    queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) })
    queryClient.invalidateQueries({ queryKey: projectKeys.all })
  }

  function handleRemoveMember(member: ProjectMember) {
    const name = member.user?.name || member.user?.email || member.userId
    const shouldRemove = window.confirm(`¿Remover a ${name} de este proyecto?`)

    if (shouldRemove) {
      removeMemberMutation.mutate(member.userId)
    }
  }

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h6">Miembros</Typography>
        <Typography color="text.secondary">Personas con acceso y rol dentro de este proyecto.</Typography>
      </Box>

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc' }}>
        <Stack
          component="form"
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <TextField
            select
            label="Usuario"
            size="small"
            fullWidth
            disabled={usersQuery.isLoading || availableUsers.length === 0}
            error={Boolean(form.formState.errors.userId)}
            helperText={
              form.formState.errors.userId?.message ||
              (availableUsers.length === 0 ? 'No hay usuarios disponibles para agregar.' : undefined)
            }
            {...form.register('userId')}
          >
            {availableUsers.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                <Stack spacing={0.25}>
                  <Typography sx={{ fontWeight: 700 }}>{user.name}</Typography>
                  <Typography color="text.secondary" variant="caption">
                    {user.email}
                  </Typography>
                </Stack>
              </MenuItem>
            ))}
          </TextField>
          <TextField select label="Rol" size="small" sx={{ minWidth: { xs: '100%', md: 180 } }} {...form.register('role')}>
            {roleOptions.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            type="submit"
            variant="contained"
            startIcon={<AddIcon />}
            disabled={mutation.isPending || usersQuery.isLoading || availableUsers.length === 0}
            sx={{ minWidth: 150, textTransform: 'none', fontWeight: 800 }}
          >
            {mutation.isPending ? 'Agregando...' : 'Agregar'}
          </Button>
        </Stack>
        {usersQuery.isError ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {getErrorMessage(usersQuery.error)}
          </Alert>
        ) : null}
        {mutation.isError ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {getErrorMessage(mutation.error)}
          </Alert>
        ) : null}
      </Paper>

      {isLoading ? <LoadingState /> : null}
      {error ? <Alert severity="error">{getErrorMessage(error)}</Alert> : null}
      {updateRoleMutation.isError ? <Alert severity="error">{getErrorMessage(updateRoleMutation.error)}</Alert> : null}
      {removeMemberMutation.isError ? <Alert severity="error">{getErrorMessage(removeMemberMutation.error)}</Alert> : null}
      {!isLoading && members.length === 0 ? (
        <EmptyState title="Sin miembros" message="Agrega miembros por correo para colaborar en este proyecto." />
      ) : null}

      <Grid container spacing={2}>
        {members.map((member) => (
          <Grid key={member.userId} size={{ xs: 12, md: 6 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#172033' }}>{(member.user?.name || member.userId).charAt(0).toUpperCase()}</Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontWeight: 800 }}>{member.user?.name || member.userId}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {member.user?.email || 'Sin correo'}
                  </Typography>
                </Box>
                <TextField
                  select
                  label="Rol"
                  size="small"
                  value={member.role}
                  disabled={member.role === 'OWNER' || updateRoleMutation.isPending}
                  sx={{ minWidth: 130 }}
                  onChange={(event) =>
                    updateRoleMutation.mutate({
                      userId: member.userId,
                      role: event.target.value as ProjectRole,
                    })
                  }
                >
                  {member.role === 'OWNER' ? (
                    <MenuItem value="OWNER">
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <GroupsIcon fontSize="small" />
                        <span>Owner</span>
                      </Stack>
                    </MenuItem>
                  ) : null}
                  {roleOptions.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </TextField>
                <Tooltip title={member.role === 'OWNER' ? 'No se puede remover al owner' : 'Remover miembro'}>
                  <span>
                    <IconButton
                      aria-label="Remover miembro"
                      color="error"
                      disabled={member.role === 'OWNER' || removeMemberMutation.isPending}
                      onClick={() => handleRemoveMember(member)}
                    >
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}
