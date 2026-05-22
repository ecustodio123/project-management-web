import { Box, CircularProgress } from '@mui/material'

export function LoadingState() {
  return (
    <Box sx={{ display: 'grid', minHeight: 240, placeItems: 'center' }}>
      <CircularProgress />
    </Box>
  )
}
