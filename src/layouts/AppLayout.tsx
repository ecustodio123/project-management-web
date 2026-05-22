import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'
import { Outlet } from 'react-router'
import { useAuth } from '../auth/authContext'

export function AppLayout() {
  const { logout, user } = useAuth()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar color="inherit" elevation={0} position="sticky" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <IconButton edge="start" sx={{ mr: 1 }} aria-label="Open navigation">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Project Portal
          </Typography>
          <Typography color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' }, mr: 2 }}>
            {user?.name}
          </Typography>
          <Button startIcon={<LogoutIcon />} onClick={logout} variant="outlined">
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
