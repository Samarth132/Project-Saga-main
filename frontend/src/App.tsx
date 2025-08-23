import { Alert, AppBar, Box, Button, IconButton, Snackbar, Toolbar, Typography } from '@mui/material';
import useThemeStore from './store/themeStore';
import useSnackbarStore from './store/snackbarStore';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Routes, Route, Link as RouterLink, Navigate } from 'react-router-dom';
import WorldForgePage from './pages/WorldForgePage';
import TemplatesPage from './pages/TemplatesPage';
import ProjectSelectionPage from './pages/ProjectSelectionPage';
import ProtectedRoute from './components/ProtectedRoute';
import useProjectStore from './store/projectStore';
import CartographerPage from './pages/CartographerPage';

const Home = () => {
  const { selectedProject } = useProjectStore();
  return selectedProject ? <Navigate to="/world-forge" /> : <ProjectSelectionPage />;
};

function App() {
  const { mode, toggleMode } = useThemeStore();
  const { selectedProject, clearSelectedProject } = useProjectStore();
  const { open, message, severity, hideSnackbar } = useSnackbarStore();

  const handleLogout = () => {
    clearSelectedProject();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
  <AppBar position="sticky" sx={{ top: 0, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar variant='dense'>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Project Saga
            </RouterLink>
          </Typography>
          {selectedProject && (
            <>
              <Button color="inherit" component={RouterLink} to="/world-forge">World Forge</Button>
              <Button color="inherit" component={RouterLink} to="/templates">Templates</Button>
              <Button color="inherit" component={RouterLink} to="/cartographer">Cartographer</Button>
              <Button color="inherit" onClick={handleLogout}>Change Project</Button>
            </>
          )}
          <IconButton sx={{ ml: 1 }} onClick={toggleMode} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/world-forge" element={<WorldForgePage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            {/* <Route path="/graph" element={<GraphViewPage />} /> */}
            {/* <Route path="/story-weaver" element={<StoryWeaverPage />} /> */}
            <Route path="/cartographer" element={<CartographerPage />} />
          </Route>
        </Routes>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={hideSnackbar}>
        <Alert onClose={hideSnackbar} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;