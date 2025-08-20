import { Navigate, Outlet } from 'react-router-dom';
import useProjectStore from '../store/projectStore';

const ProtectedRoute = () => {
  const { selectedProject } = useProjectStore();

  if (!selectedProject) {
    // If no project is selected, redirect to the project selection page
    return <Navigate to="/" replace />;
  }

  // If a project is selected, render the child route content
  return <Outlet />;
};

export default ProtectedRoute;