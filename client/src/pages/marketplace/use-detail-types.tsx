import { RulesetSalesPage } from '@/libs/compass-api';
import {
  AccountBox,
  Article,
  AutoStories,
  Backpack,
  Calculate,
  GridOn,
  Groups,
} from '@mui/icons-material';

type RulesetSalesPageDetails = {
  archetypeCount: number;
  attributeCount: number;
  itemCount: number;
  chartCount: number;
  documentCount: number;
  pageCount: number;
  templateCount: number;
};

export const useDetailTypes = (salesPage?: RulesetSalesPage | null) => {
  const details = JSON.parse(salesPage?.details ?? '{}') as RulesetSalesPageDetails;

  const detailTypes = [
    {
      title: 'Pages',
      icon: <AutoStories sx={{ fontSize: '1.5rem' }} />,
      count: details.pageCount,
    },
    {
      title: 'Templates',
      icon: <AccountBox sx={{ fontSize: '1.5rem' }} />,
      count: details.templateCount,
    },
    {
      title: 'Attributes',
      icon: <Calculate sx={{ fontSize: '1.5rem' }} />,
      count: details.attributeCount,
    },
    {
      title: 'Items',
      icon: <Backpack sx={{ fontSize: '1.5rem' }} />,
      count: details.itemCount,
    },
    {
      title: 'Archetypes',
      icon: <Groups sx={{ fontSize: '1.5rem' }} />,
      count: details.archetypeCount,
    },
    {
      title: 'Documents',
      icon: <Article sx={{ fontSize: '1.5rem' }} />,
      count: details.documentCount,
    },
    {
      title: 'Charts',
      icon: <GridOn sx={{ fontSize: '1.5rem' }} />,
      count: details.chartCount,
    },
  ];

  return detailTypes;
};
