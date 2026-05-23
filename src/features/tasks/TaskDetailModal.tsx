import { zodResolver } from '@hookform/resolvers/zod'
import CloseIcon from '@mui/icons-material/Close'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import SendIcon from '@mui/icons-material/Send'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LoadingState } from '../../components/LoadingState'
import { commentKeys } from '../comments/commentKeys'
import { createComment, getTaskComments } from '../comments/commentsApi'
import { taskKeys } from './taskKeys'
import { getTask } from './tasksApi'
import { getErrorMessage } from '../../utils/getErrorMessage'
import type { Task } from '../../types/task'

const commentSchema = z.object({
  content: z.string().min(1, 'Escribe un comentario'),
})

type CommentFormValues = z.infer<typeof commentSchema>

type TaskDetailModalProps = {
  open: boolean
  taskId: string
  onClose: () => void
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

export function TaskDetailModal({ open, taskId, onClose }: TaskDetailModalProps) {
  const queryClient = useQueryClient()

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

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
    },
  })

  const createCommentMutation = useMutation({
    mutationFn: (values: CommentFormValues) => createComment(taskId, values),
    onSuccess: () => {
      form.reset()
      queryClient.invalidateQueries({ queryKey: commentKeys.byTask(taskId) })
    },
  })

  const task = taskQuery.data
  const comments = commentsQuery.data ?? []

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
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                  {task.title}
                </Typography>
                <Typography color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {task.description || 'Sin descripción'}
                </Typography>
              </Box>

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
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Stack>
            </Stack>

            <Box sx={{ borderLeft: { md: '1px solid' }, borderColor: 'divider', bgcolor: '#f8fafc', p: 3 }}>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="h6">Detalles</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Metadatos principales de la tarea.
                  </Typography>
                </Box>

                <DetailItem label="Estado">
                  <Chip label={statusLabel[task.status]} size="small" sx={{ bgcolor: '#eff6ff', fontWeight: 700 }} />
                </DetailItem>
                <DetailItem label="Prioridad">
                  <Chip label={priorityLabel[task.priority]} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                </DetailItem>
                <DetailItem label="Asignado a">{task.assignee?.name || 'Sin asignar'}</DetailItem>
                <DetailItem label="Creado por">{task.createdBy?.name || 'Sin responsable'}</DetailItem>
                <DetailItem label="Fecha límite">{formatDate(task.dueDate)}</DetailItem>
                <DetailItem label="Creado">{formatDateTime(task.createdAt)}</DetailItem>
              </Stack>
            </Box>
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  )
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

function formatDate(value?: string | null) {
  if (!value) return 'Sin fecha'

  return new Intl.DateTimeFormat('es', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
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
