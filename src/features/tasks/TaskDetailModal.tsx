import { zodResolver } from '@hookform/resolvers/zod'
import CloseIcon from '@mui/icons-material/Close'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import DownloadIcon from '@mui/icons-material/Download'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import SaveIcon from '@mui/icons-material/Save'
import SendIcon from '@mui/icons-material/Send'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ChangeEvent, ReactNode } from 'react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { LoadingState } from '../../components/LoadingState'
import { useNotification } from '../../providers/notificationContext'
import { commentKeys } from '../comments/commentKeys'
import { createComment, deleteComment, getTaskComments } from '../comments/commentsApi'
import { fileKeys } from '../files/fileKeys'
import { deleteFile, downloadFile, getTaskFiles, uploadTaskFile } from '../files/filesApi'
import { projectKeys } from '../projects/projectKeys'
import { getProjectMembers } from '../projects/projectsApi'
import { taskKeys } from './taskKeys'
import { deleteTask, getTask, updateTask } from './tasksApi'
import { getErrorMessage } from '../../utils/getErrorMessage'
import type { TaskPriority, TaskStatus } from '../../types/task'
import type { TaskFile } from '../../types/file'

const commentSchema = z.object({
  content: z.string().min(1, 'Escribe un comentario'),
})

type CommentFormValues = z.infer<typeof commentSchema>

type TaskDetailModalProps = {
  open: boolean
  taskId: string
  projectId: string
  onClose: () => void
}

const taskSchema = z.object({
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
  description: z.string().optional(),
})

const taskDetailsSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  assigneeId: z.string().optional(),
  dueDate: z.string().optional(),
})

type TaskFormValues = z.infer<typeof taskSchema>
type TaskDetailsFormValues = z.infer<typeof taskDetailsSchema>

export function TaskDetailModal({ open, taskId, projectId, onClose }: TaskDetailModalProps) {
  const queryClient = useQueryClient()
  const { notify } = useNotification()

  const taskQuery = useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => getTask(taskId),
    enabled: open && Boolean(taskId),
  })

  const commentsQuery = useQuery({
    queryKey: commentKeys.byTask(taskId),
    queryFn: () => getTaskComments(taskId),
    enabled: open && Boolean(taskId),
  })

  const filesQuery = useQuery({
    queryKey: fileKeys.byTask(taskId),
    queryFn: () => getTaskFiles(taskId),
    enabled: open && Boolean(taskId),
  })

  const membersQuery = useQuery({
    queryKey: projectKeys.members(projectId),
    queryFn: () => getProjectMembers(projectId),
    enabled: open && Boolean(projectId),
  })

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
    },
  })

  const taskForm = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const taskDetailsForm = useForm<TaskDetailsFormValues>({
    resolver: zodResolver(taskDetailsSchema),
    defaultValues: {
      status: 'TODO',
      priority: 'MEDIUM',
      assigneeId: '',
      dueDate: '',
    },
  })

  const createCommentMutation = useMutation({
    mutationFn: (values: CommentFormValues) => createComment(taskId, values),
    onSuccess: () => {
      form.reset()
      queryClient.invalidateQueries({ queryKey: commentKeys.byTask(taskId) })
      notify('Comentario agregado.')
    },
    onError: (error) => {
      notify(getErrorMessage(error), 'error')
    },
  })

  const updateTaskMutation = useMutation({
    mutationFn: (values: TaskFormValues) =>
      updateTask(taskId, {
        title: values.title,
        description: values.description?.trim() ? values.description : null,
      }),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(taskKeys.detail(taskId), updatedTask)
      queryClient.invalidateQueries({ queryKey: taskKeys.byProject(projectId) })
      notify('Tarea actualizada.')
    },
    onError: (error) => {
      notify(getErrorMessage(error), 'error')
    },
  })

  const updateTaskDetailsMutation = useMutation({
    mutationFn: (values: TaskDetailsFormValues) =>
      updateTask(taskId, {
        status: values.status,
        priority: values.priority,
        assigneeId: values.assigneeId || null,
        dueDate: values.dueDate || null,
      }),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(taskKeys.detail(taskId), updatedTask)
      queryClient.invalidateQueries({ queryKey: taskKeys.byProject(projectId) })
      notify('Detalles actualizados.')
    },
    onError: (error) => {
      notify(getErrorMessage(error), 'error')
    },
  })

  const deleteTaskMutation = useMutation({
    mutationFn: () => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.byProject(projectId) })
      notify('Tarea eliminada.')
      onClose()
    },
    onError: (error) => {
      notify(getErrorMessage(error), 'error')
    },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byTask(taskId) })
      notify('Comentario eliminado.')
    },
    onError: (error) => {
      notify(getErrorMessage(error), 'error')
    },
  })

  const uploadFileMutation = useMutation({
    mutationFn: (file: File) => uploadTaskFile(taskId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fileKeys.byTask(taskId) })
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) })
      notify('Archivo subido.')
    },
    onError: (error) => {
      notify(getErrorMessage(error), 'error')
    },
  })

  const deleteFileMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fileKeys.byTask(taskId) })
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) })
      notify('Archivo eliminado.')
    },
    onError: (error) => {
      notify(getErrorMessage(error), 'error')
    },
  })

  const downloadFileMutation = useMutation({
    mutationFn: async (file: TaskFile) => {
      const download = await downloadFile(file.id)
      const anchor = document.createElement('a')

      if (download.type === 'url') {
        anchor.href = download.url
        anchor.target = '_blank'
        anchor.rel = 'noreferrer'
      } else {
        const url = URL.createObjectURL(download.blob)
        anchor.href = url
        anchor.download = download.filename ?? file.originalName
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      }

      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
    },
    onSuccess: () => {
      notify('Descarga iniciada.')
    },
    onError: (error) => {
      notify(getErrorMessage(error), 'error')
    },
  })

  const task = taskQuery.data
  const comments = commentsQuery.data ?? []
  const files = filesQuery.data ?? []

  useEffect(() => {
    if (!task) return

    taskForm.reset({
      title: task.title,
      description: task.description ?? '',
    })
    taskDetailsForm.reset({
      status: task.status,
      priority: task.priority,
      assigneeId: task.assigneeId ?? '',
      dueDate: task.dueDate ? toDateInputValue(task.dueDate) : '',
    })
  }, [task, taskDetailsForm, taskForm])

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (file) {
      uploadFileMutation.mutate(file)
    }

    event.target.value = ''
  }

  function handleDeleteTask() {
    const shouldDelete = window.confirm('¿Eliminar esta tarea? Esta acción no se puede deshacer.')

    if (shouldDelete) {
      deleteTaskMutation.mutate()
    }
  }

  function submitDetails(values?: Partial<TaskDetailsFormValues>) {
    const currentValues = taskDetailsForm.getValues()
    updateTaskDetailsMutation.mutate({ ...currentValues, ...values })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            minHeight: { xs: '90vh', md: 680 },
            overflow: 'hidden',
          },
        },
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2,
            bgcolor: '#f8fafc',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography color="text.secondary" variant="caption">
              Tarea
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }} noWrap>
              {task?.title ?? 'Cargando tarea...'}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Copiar enlace">
              <IconButton onClick={() => navigator.clipboard.writeText(window.location.href)} aria-label="Copiar enlace">
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar tarea">
              <IconButton
                onClick={handleDeleteTask}
                aria-label="Eliminar tarea"
                color="error"
                disabled={deleteTaskMutation.isPending}
              >
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            </Tooltip>
            <IconButton onClick={onClose} aria-label="Cerrar tarea">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {taskQuery.isLoading ? <LoadingState /> : null}
        {taskQuery.isError ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">{getErrorMessage(taskQuery.error)}</Alert>
          </Box>
        ) : null}

        {task ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 280px' }, minHeight: 620 }}>
            <Stack spacing={3} sx={{ p: 3 }}>
              <Paper
                component="form"
                variant="outlined"
                sx={{ p: 2.5, borderRadius: 3, bgcolor: '#f8fafc' }}
                onSubmit={taskForm.handleSubmit((values) => updateTaskMutation.mutate(values))}
              >
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="h6">Editar tarea</Typography>
                    <Typography color="text.secondary" variant="body2">
                      Actualiza el título y la descripción principal.
                    </Typography>
                  </Box>
                  <TextField
                    label="Título"
                    fullWidth
                    error={Boolean(taskForm.formState.errors.title)}
                    helperText={taskForm.formState.errors.title?.message}
                    {...taskForm.register('title')}
                  />
                  <TextField
                    label="Descripción"
                    multiline
                    minRows={4}
                    fullWidth
                    error={Boolean(taskForm.formState.errors.description)}
                    helperText={taskForm.formState.errors.description?.message}
                    {...taskForm.register('description')}
                  />
                  {updateTaskMutation.isError ? (
                    <Alert severity="error">{getErrorMessage(updateTaskMutation.error)}</Alert>
                  ) : null}
                  {updateTaskMutation.isSuccess ? <Alert severity="success">Tarea actualizada.</Alert> : null}
                  {deleteTaskMutation.isError ? <Alert severity="error">{getErrorMessage(deleteTaskMutation.error)}</Alert> : null}
                  <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <Button
                      type="button"
                      color="error"
                      variant="outlined"
                      startIcon={<DeleteOutlineOutlinedIcon />}
                      onClick={handleDeleteTask}
                      disabled={deleteTaskMutation.isPending}
                      sx={{ textTransform: 'none', fontWeight: 800 }}
                    >
                      {deleteTaskMutation.isPending ? 'Eliminando...' : 'Eliminar tarea'}
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={updateTaskMutation.isPending}
                      sx={{ textTransform: 'none', fontWeight: 800 }}
                    >
                      {updateTaskMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                  </Stack>
                </Stack>
              </Paper>

              <Divider />

              <Stack spacing={2}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  sx={{ justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' } }}
                >
                  <Box>
                    <Typography variant="h6">Adjuntos</Typography>
                    <Typography color="text.secondary" variant="body2">
                      Archivos relacionados al trabajo de este ticket.
                    </Typography>
                  </Box>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadFileIcon />}
                    disabled={uploadFileMutation.isPending}
                    sx={{ textTransform: 'none', fontWeight: 800 }}
                  >
                    {uploadFileMutation.isPending ? 'Subiendo...' : 'Subir archivo'}
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>
                </Stack>

                {uploadFileMutation.isError ? <Alert severity="error">{getErrorMessage(uploadFileMutation.error)}</Alert> : null}
                {deleteFileMutation.isError ? <Alert severity="error">{getErrorMessage(deleteFileMutation.error)}</Alert> : null}
                {downloadFileMutation.isError ? <Alert severity="error">{getErrorMessage(downloadFileMutation.error)}</Alert> : null}
                {filesQuery.isLoading ? <LoadingState /> : null}
                {filesQuery.isError ? <Alert severity="error">{getErrorMessage(filesQuery.error)}</Alert> : null}
                {!filesQuery.isLoading && files.length === 0 ? (
                  <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 800 }}>Sin adjuntos</Typography>
                    <Typography color="text.secondary">Sube archivos para documentar este ticket.</Typography>
                  </Paper>
                ) : null}

                <Stack spacing={1}>
                  {files.map((file) => (
                    <Paper key={file.id} variant="outlined" sx={{ p: 1.5, borderRadius: 3 }}>
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
                          <InsertDriveFileOutlinedIcon fontSize="small" />
                        </Box>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography sx={{ fontWeight: 800 }} noWrap>
                            {file.originalName}
                          </Typography>
                          <Typography color="text.secondary" variant="caption">
                            {formatFileSize(file.size)} · {formatDateTime(file.createdAt)}
                          </Typography>
                        </Box>
                        <Tooltip title="Descargar archivo">
                          <IconButton
                            aria-label="Descargar archivo"
                            onClick={() => downloadFileMutation.mutate(file)}
                            disabled={downloadFileMutation.isPending}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar archivo">
                          <IconButton
                            aria-label="Eliminar archivo"
                            color="error"
                            onClick={() => deleteFileMutation.mutate(file.id)}
                            disabled={deleteFileMutation.isPending}
                          >
                            <DeleteOutlineOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Stack>

              <Divider />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6">Comentarios</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Conversación y contexto de esta tarea.
                  </Typography>
                </Box>

                <Paper
                  component="form"
                  variant="outlined"
                  sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc' }}
                  onSubmit={form.handleSubmit((values) => createCommentMutation.mutate(values))}
                >
                  <Stack spacing={1.5}>
                    <TextField
                      label="Agregar comentario"
                      multiline
                      minRows={3}
                      fullWidth
                      error={Boolean(form.formState.errors.content)}
                      helperText={form.formState.errors.content?.message}
                      {...form.register('content')}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      endIcon={<SendIcon />}
                      disabled={createCommentMutation.isPending}
                      sx={{ alignSelf: 'flex-end', textTransform: 'none', fontWeight: 800 }}
                    >
                      {createCommentMutation.isPending ? 'Publicando...' : 'Comentar'}
                    </Button>
                    {createCommentMutation.isError ? (
                      <Alert severity="error">{getErrorMessage(createCommentMutation.error)}</Alert>
                    ) : null}
                  </Stack>
                </Paper>

                {commentsQuery.isLoading ? <LoadingState /> : null}
                {commentsQuery.isError ? <Alert severity="error">{getErrorMessage(commentsQuery.error)}</Alert> : null}
                {!commentsQuery.isLoading && comments.length === 0 ? (
                  <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 800 }}>Sin comentarios</Typography>
                    <Typography color="text.secondary">Sé el primero en agregar contexto a esta tarea.</Typography>
                  </Paper>
                ) : null}

                <Stack spacing={1.5}>
                  {comments.map((comment) => (
                    <Paper key={comment.id} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                        <Avatar sx={{ width: 34, height: 34, bgcolor: '#172033', fontSize: 14 }}>
                          {(comment.user?.name || 'U').charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                            <Typography sx={{ fontWeight: 800 }}>{comment.user?.name || 'Usuario'}</Typography>
                            <Typography color="text.secondary" variant="caption">
                              {formatDateTime(comment.createdAt)}
                            </Typography>
                          </Stack>
                          <Typography sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>{comment.content}</Typography>
                        </Box>
                        <Tooltip title="Eliminar comentario">
                          <IconButton
                            aria-label="Eliminar comentario"
                            color="error"
                            onClick={() => deleteCommentMutation.mutate(comment.id)}
                            disabled={deleteCommentMutation.isPending}
                            size="small"
                          >
                            <DeleteOutlineOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
                {deleteCommentMutation.isError ? (
                  <Alert severity="error">{getErrorMessage(deleteCommentMutation.error)}</Alert>
                ) : null}
              </Stack>
            </Stack>

            <Box sx={{ borderLeft: { md: '1px solid' }, borderColor: 'divider', bgcolor: '#f8fafc', p: 3 }}>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="h6">Detalles</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Campos editables del ticket.
                  </Typography>
                </Box>

                {updateTaskDetailsMutation.isError ? (
                  <Alert severity="error">{getErrorMessage(updateTaskDetailsMutation.error)}</Alert>
                ) : null}
                {updateTaskDetailsMutation.isSuccess ? <Alert severity="success">Detalles actualizados.</Alert> : null}

                <Controller
                  control={taskDetailsForm.control}
                  name="status"
                  render={({ field }) => (
                    <TextField
                      select
                      label="Estado"
                      size="small"
                      fullWidth
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(event) => {
                        const value = event.target.value as TaskStatus
                        field.onChange(value)
                        submitDetails({ status: value })
                      }}
                    >
                      {taskStatusOptions.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          {status.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                <Controller
                  control={taskDetailsForm.control}
                  name="priority"
                  render={({ field }) => (
                    <TextField
                      select
                      label="Prioridad"
                      size="small"
                      fullWidth
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(event) => {
                        const value = event.target.value as TaskPriority
                        field.onChange(value)
                        submitDetails({ priority: value })
                      }}
                    >
                      {taskPriorityOptions.map((priority) => (
                        <MenuItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                {membersQuery.isError ? <Alert severity="error">{getErrorMessage(membersQuery.error)}</Alert> : null}
                <Controller
                  control={taskDetailsForm.control}
                  name="assigneeId"
                  render={({ field }) => (
                    <TextField
                      select
                      label="Asignado a"
                      size="small"
                      fullWidth
                      value={field.value}
                      onBlur={field.onBlur}
                      disabled={membersQuery.isLoading}
                      helperText={membersQuery.isLoading ? 'Cargando miembros...' : undefined}
                      onChange={(event) => {
                        const value = event.target.value
                        field.onChange(value)
                        submitDetails({ assigneeId: value })
                      }}
                    >
                      <MenuItem value="">Sin asignar</MenuItem>
                      {(membersQuery.data ?? []).map((member) => (
                        <MenuItem key={member.userId} value={member.userId}>
                          <Stack spacing={0.25}>
                            <Typography sx={{ fontWeight: 700 }}>
                              {member.user?.name || member.userId}
                            </Typography>
                            <Typography color="text.secondary" variant="caption">
                              {member.user?.email || member.role}
                            </Typography>
                          </Stack>
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                <Controller
                  control={taskDetailsForm.control}
                  name="dueDate"
                  render={({ field }) => (
                    <TextField
                      label="Fecha límite"
                      type="date"
                      size="small"
                      fullWidth
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(event) => {
                        const value = event.target.value
                        field.onChange(value)
                        submitDetails({ dueDate: value })
                      }}
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  )}
                />
                <DetailItem label="Creado por">{task.createdBy?.name || 'Sin responsable'}</DetailItem>
                <DetailItem label="Creado">{formatDateTime(task.createdAt)}</DetailItem>
              </Stack>
            </Box>
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

const taskStatusOptions: Array<{ value: TaskStatus; label: string }> = [
  { value: 'TODO', label: 'To do' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'REVIEW', label: 'Review' },
  { value: 'DONE', label: 'Done' },
]

const taskPriorityOptions: Array<{ value: TaskPriority; label: string }> = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
]

function toDateInputValue(value: string) {
  return new Date(value).toISOString().slice(0, 10)
}

type DetailItemProps = {
  label: string
  children: ReactNode
}

function DetailItem({ label, children }: DetailItemProps) {
  return (
    <Box>
      <Typography color="text.secondary" variant="caption">
        {label}
      </Typography>
      <Box sx={{ mt: 0.5 }}>
        {typeof children === 'string' ? <Typography sx={{ fontWeight: 700 }}>{children}</Typography> : children}
      </Box>
    </Box>
  )
}

function formatDateTime(value?: string | null) {
  if (!value) return 'Sin fecha'

  return new Intl.DateTimeFormat('es', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatFileSize(size?: number) {
  if (!size) return '0 KB'

  if (size < 1024 * 1024) {
    return `${Math.ceil(size / 1024)} KB`
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`
}
