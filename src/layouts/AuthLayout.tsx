import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import GroupsIcon from '@mui/icons-material/Groups'
import TimelineIcon from '@mui/icons-material/Timeline'
import { Box, Container, Paper, Stack, Typography } from '@mui/material'
import { Outlet } from 'react-router'

export function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f4f6fb',
        backgroundImage:
          'radial-gradient(circle at 18% 12%, rgba(37, 99, 235, 0.14), transparent 32%), radial-gradient(circle at 86% 4%, rgba(20, 184, 166, 0.13), transparent 28%)',
        display: 'flex',
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="lg" sx={{ display: 'flex' }}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            minHeight: { xs: 'auto', md: 680 },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(380px, 460px)' },
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 24px 70px rgba(15, 23, 42, 0.10)',
          }}
        >
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 5,
              bgcolor: '#172033',
              color: 'common.white',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 'auto -120px -120px auto',
                width: 320,
                height: 320,
                borderRadius: '50%',
                background: 'rgba(37, 99, 235, 0.34)',
              },
            }}
          >
            <Stack spacing={5} sx={{ position: 'relative', zIndex: 1 }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'primary.main',
                  }}
                >
                  <AssignmentTurnedInIcon />
                </Box>
                <Box>
                  <Typography variant="h6">ProjectFlow</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.68)' }} variant="body2">
                    Client portal
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={2}>
                <Typography variant="h3" sx={{ maxWidth: 540, fontWeight: 800, lineHeight: 1.08 }}>
                  Centraliza proyectos, tareas y clientes en un solo workspace.
                </Typography>
                <Typography sx={{ maxWidth: 520, color: 'rgba(255,255,255,0.72)', fontSize: 17 }}>
                  Una experiencia simple para coordinar entregables, revisar avances y mantener al equipo alineado.
                </Typography>
              </Stack>
            </Stack>

            <Stack spacing={2.5} sx={{ position: 'relative', zIndex: 1 }}>
              {authHighlights.map((item) => (
                <Stack key={item.title} direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: 'rgba(255,255,255,0.10)',
                      color: '#93c5fd',
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{item.title}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.64)' }} variant="body2">
                      {item.description}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              p: { xs: 3, sm: 5 },
              bgcolor: 'common.white',
            }}
          >
            <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4 }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'primary.main',
                    color: 'common.white',
                  }}
                >
                  <AssignmentTurnedInIcon />
                </Box>
                <Box>
                  <Typography variant="h6">ProjectFlow</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Client portal
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Outlet />
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

const authHighlights = [
  {
    title: 'Tableros enfocados',
    description: 'Prioridades, estados y responsables claros para cada proyecto.',
    icon: <AssignmentTurnedInIcon fontSize="small" />,
  },
  {
    title: 'Clientes y equipo',
    description: 'Colabora con miembros internos y usuarios externos sin fricción.',
    icon: <GroupsIcon fontSize="small" />,
  },
  {
    title: 'Actividad trazable',
    description: 'Historial de cambios y avances visible para todos los involucrados.',
    icon: <TimelineIcon fontSize="small" />,
  },
]
