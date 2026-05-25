import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../auth/authContext";

export function AppLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f6fb",
        backgroundImage:
          "radial-gradient(circle at 8% 0%, rgba(37, 99, 235, 0.10), transparent 28%), radial-gradient(circle at 88% 0%, rgba(20, 184, 166, 0.10), transparent 26%)",
      }}
    >
      <AppBar
        color="inherit"
        elevation={0}
        position="sticky"
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(14px)",
        }}
      >
        <Toolbar sx={{ minHeight: 68 }}>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: "center", flexGrow: 1 }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                bgcolor: "primary.main",
                color: "common.white",
                boxShadow: "0 10px 20px rgba(37, 99, 235, 0.24)",
              }}
            >
              <AssignmentTurnedInIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
                ProjectFlow
              </Typography>
              <Typography color="text.secondary" variant="caption">
                Project management workspace
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Avatar
              sx={{ width: 34, height: 34, bgcolor: "#172033", fontSize: 14 }}
            >
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                {user?.name || "User"}
              </Typography>
              <Typography color="text.secondary" variant="caption">
                {user?.email}
              </Typography>
            </Box>
          </Stack>

          <Button
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            variant="outlined"
            sx={{ ml: 2, textTransform: "none", fontWeight: 700 }}
          >
            Salir
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}
