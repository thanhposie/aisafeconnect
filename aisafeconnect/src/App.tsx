import MainLayout from './components/layout/MainLayout';
import AppRoutes from './routes';

/**
 * App — root component.
 * Wraps all routes inside MainLayout (Navbar + main + Footer).
 */
export default function App() {
  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
}
