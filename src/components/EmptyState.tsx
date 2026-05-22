import { Box, Typography } from '@mui/material'

type EmptyStateProps = {
  title: string
  message?: string
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 2, p: 4, textAlign: 'center' }}>
      <Typography variant="h6">{title}</Typography>
      {message ? (
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {message}
        </Typography>
      ) : null}
    </Box>
  )
}
