import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/components/layout';
import { OverviewPage } from '@/features/overview/OverviewPage';
import { ExplorerPage } from '@/features/explorer/ExplorerPage';
import { ComparisonPage } from '@/features/comparison/ComparisonPage';
import { AnalogFinderPage } from '@/features/analog-finder/AnalogFinderPage';
import { SuitabilityPage } from '@/features/suitability/SuitabilityPage';
import { RoverLabPage } from '@/features/rover-lab/RoverLabPage';
import { CatalogPage } from '@/features/catalog/CatalogPage';
import { MethodologyPage } from '@/features/methodology/MethodologyPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <OverviewPage />,
      },
      {
        path: 'explorer',
        element: <ExplorerPage />,
      },
      {
        path: 'compare',
        element: <ComparisonPage />,
      },
      {
        path: 'analog-finder',
        element: <AnalogFinderPage />,
      },
      {
        path: 'suitability',
        element: <SuitabilityPage />,
      },
      {
        path: 'rover-lab',
        element: <RoverLabPage />,
      },
      {
        path: 'catalog',
        element: <CatalogPage />,
      },
      {
        path: 'methodology',
        element: <MethodologyPage />,
      },
    ],
  },
]);
