import { Box, Container, Paper, Typography } from '@mui/material'
import { Outlet } from 'react-router'

export function AuthLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', py: 4 }}>
      <Container maxWidth="xs">
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4">Project Portal</Typography>
          <Typography color="text.secondary">Client and team workspace</Typography>
        </Box>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Outlet />
        </Paper>
      </Container>
    </Box>
  )
}
