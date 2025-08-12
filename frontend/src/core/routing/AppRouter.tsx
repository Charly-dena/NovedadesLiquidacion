import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from '@/core/layout';
import { Dashboard } from '@/pages/Dashboard';
import * as LiquidacionesModule from '@/modules/liquidaciones';
import { EmpresasPage } from '@/pages/Empresas';
import { ReportesPage } from '@/pages/Reportes';
import { ConfiguracionPage } from '@/pages/Configuracion';
import { NovedadesPage } from '@/pages/Novedades';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'liquidaciones',
        children: [
          {
            index: true,
            element: <LiquidacionesModule.List />,
          },
          {
            path: 'nueva',
            element: <LiquidacionesModule.Create />,
          },
          {
            path: 'detalle',
            element: <LiquidacionesModule.Detail />,
          },
          {
            path: ':id/editar',
            element: <LiquidacionesModule.Edit />,
          },
        ],
      },
      {
        path: 'empresas',
        element: <EmpresasPage />,
      },
      {
        path: 'reportes',
        element: <ReportesPage />,
      },
      {
        path: 'configuracion',
        element: <ConfiguracionPage />,
      },
      {
        path: 'novedades',
        element: <NovedadesPage />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}